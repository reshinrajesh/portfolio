import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl) {
    console.warn("WARNING: SUPABASE_URL is missing during build time!");
}

type StubResult = { data: unknown; error: null };

/**
 * Stand-in used when Supabase credentials are absent (local builds, CI).
 *
 * The previous version hand-listed the exact chains in use, so adding a link -
 * .select().eq().order(), say - crashed the build with "order is not a
 * function". This proxies any method back onto itself and resolves to an empty
 * result, so a missing env var degrades instead of failing the build.
 */
function createStubClient(): any {
    const chain = (result: StubResult): any => {
        const settled = Promise.resolve(result);

        return new Proxy(
            {},
            {
                get(_target, prop) {
                    if (prop === "then" || prop === "catch" || prop === "finally") {
                        return settled[prop as "then" | "catch" | "finally"].bind(settled);
                    }

                    if (typeof prop === "symbol") {
                        return undefined;
                    }

                    // Row-returning terminators yield null rather than [].
                    if (prop === "single" || prop === "maybeSingle") {
                        return () => chain({ data: null, error: null });
                    }

                    return () => chain(result);
                },
            },
        );
    };

    return { from: () => chain({ data: [], error: null }) };
}

// Standard client for public/authenticated user interactions
export const supabase = supabaseUrl
    ? createClient(supabaseUrl, supabaseKey || "dummy")
    : createStubClient();

// Admin client for server-side logic that needs to bypass RLS (NOC, Auth management, etc.)
export const supabaseAdmin = supabaseUrl 
    ? createClient(supabaseUrl, supabaseServiceKey || supabaseKey || "dummy", {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
    : createStubClient();
