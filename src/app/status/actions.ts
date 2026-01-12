"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getIncidents() {
    const { data, error } = await supabase
        .from('status_incidents')
        .select('*')
        .order('date', { ascending: false });

    if (error) {
        console.error("Error fetching incidents:", error);
        return [];
    }
    return data;
}

export async function addIncident(formData: { title: string, description: string, status: string, date: string }) {
    const { error } = await supabase
        .from('status_incidents')
        .insert([
            {
                title: formData.title,
                description: formData.description,
                status: formData.status,
                date: new Date(formData.date).toISOString(),
                updates: [] // Initial empty updates
            }
        ]);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/status');
    revalidatePath('/admin/status');
}

export async function addIncidentUpdate(incidentId: string, update: { status: string, message: string, date: string }) {
    // First, get current updates
    const { data, error: getError } = await supabase
        .from('status_incidents')
        .select('updates')
        .eq('id', incidentId)
        .single();

    if (getError) throw new Error(getError.message);

    const currentUpdates = data.updates || [];
    const newUpdates = [...currentUpdates, { ...update, id: crypto.randomUUID() }];

    const { error: updateError } = await supabase
        .from('status_incidents')
        .update({ updates: newUpdates, status: update.status }) // Also update the main status
        .eq('id', incidentId);

    if (updateError) throw new Error(updateError.message);

    revalidatePath('/status');
    revalidatePath('/admin/status');
}

export async function deleteIncident(id: string) {
    const { error } = await supabase
        .from('status_incidents')
        .delete()
        .match({ id });

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/status');
    revalidatePath('/admin/status');
}
