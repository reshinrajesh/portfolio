import { supabase } from "@/lib/supabase-server";
import TiptapEditor from "./TiptapEditor";

export const revalidate = 0;

export default async function EditorPage({
    searchParams,
}: {
    searchParams: { id?: string };
}) {
    let post = null;

    // Awaiting searchParams is required in newer Next.js versions for dynamic rendering behavior
    // but the type signature here assumes we can access it directly or await it. 
    // In Next.js 15+ searchParams is a promise, but in 14 it's usually direct.
    // Given the context, we'll access it safely.
    const { id } = await searchParams;

    if (id) {
        const { data } = await supabase
            .from('posts')
            .select('*')
            .eq('id', id)
            .single();
        post = data;
    }

    return (
        <TiptapEditor initialPost={post} />
    );
}
