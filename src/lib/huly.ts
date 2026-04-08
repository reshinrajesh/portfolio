/**
 * Huly API Client (GraphQL)
 * 
 * This utility handles interactions with the Huly self-hosted instance.
 * Since the official @hcengineering/api-client has installation issues,
 * we use direct fetch calls to the Huly GraphQL API.
 */

const HULY_INSTANCE_URL = process.env.HULY_INSTANCE_URL || 'https://huly.reshinrajesh.in';
const HULY_EMAIL = process.env.HULY_EMAIL;
const HULY_PASSWORD = process.env.HULY_PASSWORD;
const HULY_WORKSPACE_ID = process.env.HULY_WORKSPACE_ID;
const HULY_PROJECT_ID = process.env.HULY_PROJECT_ID;

// Variable to store the session token after login
let sessionToken: string | null = null;

export async function createHulyIssue({
  name,
  email,
  subject,
  message,
  category = 'LEAD',
}: {
  name: string;
  email: string;
  subject?: string;
  message: string;
  category?: 'LEAD' | 'ALERT' | 'TASK';
}) {
  if (!HULY_EMAIL || !HULY_PASSWORD || !HULY_WORKSPACE_ID) {
    console.warn('Huly integration is not fully configured (missing credentials). Skipping task creation.');
    return null;
  }

  const token = await getSessionToken();
  if (!token) return null;

  const priority = category === 'ALERT' ? 'HIGH' : 'NORMAL';
  const titlePrefix = category === 'ALERT' ? '🚨 [ALERT]' : `[${category}]`;

  const query = `
    mutation CreateIssue($input: CreateIssueInput!) {
      createIssue(input: $input) {
        issue {
          id
          title
        }
      }
    }
  `;

  const variables = {
    input: {
      title: `${titlePrefix} ${name}: ${subject || 'New Submission'}`,
      description: `**Source:** Portfolio Website\n**Category:** ${category}\n**User:** ${name} (${email})\n\n---\n\n${message}`,
      projectId: HULY_PROJECT_ID,
      status: 'TODO',
      priority,
    },
  };

  try {
    const response = await fetch(`${HULY_INSTANCE_URL}/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ query, variables }),
    });

    const result = await response.json();
    return result.data?.createIssue?.issue || null;
  } catch (error) {
    console.error('Failed to create Huly issue:', error);
    return null;
  }
}

/**
 * Updates the status of an existing Huly issue.
 * Used for auto-resolving alerts.
 */
export async function updateHulyIssueStatus(issueId: string, status: string = 'DONE') {
  if (!issueId) return null;

  const token = await getSessionToken();
  if (!token) return null;

  const query = `
    mutation UpdateIssue($id: ID!, $input: UpdateIssueInput!) {
      updateIssue(id: $id, input: $input) {
        issue {
          id
          status
        }
      }
    }
  `;

  const variables = {
    id: issueId,
    input: {
      status,
    },
  };

  try {
    const response = await fetch(`${HULY_INSTANCE_URL}/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ query, variables }),
    });

    const result = await response.json();
    return result.data?.updateIssue?.issue || null;
  } catch (error) {
    console.error(`Failed to update Huly issue ${issueId}:`, error);
    return null;
  }
}

/**
 * Lists issues from a specific project.
 * Used for syncing content (Blogs, Skills, etc.)
 */
export async function getHulyIssues({
  projectId,
  status,
  limit = 20,
}: {
  projectId?: string;
  status?: string;
  limit?: number;
}) {
  const targetProjectId = projectId || HULY_PROJECT_ID;
  if (!HULY_EMAIL || !HULY_PASSWORD || !HULY_WORKSPACE_ID || !targetProjectId) {
    return [];
  }

  const token = await getSessionToken();
  if (!token) return [];

  const query = `
    query GetIssues($filter: IssueFilter!, $limit: Int) {
      issues(filter: $filter, limit: $limit) {
        id
        identifier
        title
        description
        status
        priority
        created_at
        updated_at
        labels {
          id
          name
        }
      }
    }
  `;

  const variables = {
    filter: {
      projectId: targetProjectId,
      ...(status ? { status } : {}),
    },
    limit,
  };

  try {
    const response = await fetch(`${HULY_INSTANCE_URL}/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ query, variables }),
    });

    const result = await response.json();
    return result.data?.issues || [];
  } catch (error) {
    console.error('Failed to fetch Huly issues:', error);
    return [];
  }
}

/**
 * Internal helper to manage session tokens
 */
async function getSessionToken() {
  if (sessionToken) return sessionToken;

  try {
    const loginRes = await fetch(`${HULY_INSTANCE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: HULY_EMAIL,
        password: HULY_PASSWORD,
        workspace: HULY_WORKSPACE_ID,
      }),
    });
    const loginData = await loginRes.json();
    sessionToken = loginData.token;
    return sessionToken;
  } catch (error) {
    console.error('Huly login failed:', error);
    return null;
  }
}
