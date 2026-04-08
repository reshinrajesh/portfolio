import { supabase } from "@/lib/supabase";
import TiptapEditor from "./TiptapEditor";

export const revalidate = 0;

export default async function EditorPage({
    searchParams,
}: {
    searchParams: Promise<{ id?: string }>;
}) {
    let post = null;

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
