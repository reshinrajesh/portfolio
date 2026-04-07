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
}: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  if (!HULY_EMAIL || !HULY_PASSWORD || !HULY_WORKSPACE_ID) {
    console.warn('Huly integration is not fully configured (missing credentials). Skipping task creation.');
    return null;
  }

  // 1. Perform Login if we don't have a token yet
  if (!sessionToken) {
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
    } catch (error) {
      console.error('Huly login failed:', error);
      return null;
    }
  }

  // 2. Create the Issue
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
      title: `[Contact] ${name}: ${subject || 'New Message'}`,
      description: `**From:** ${name} (${email})\n\n**Message:**\n${message}`,
      projectId: HULY_PROJECT_ID,
      status: 'TODO',
    },
  };

  try {
    const response = await fetch(`${HULY_INSTANCE_URL}/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`,
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
