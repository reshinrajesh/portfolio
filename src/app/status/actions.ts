"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getIncidents() {
    try {
        const { data, error } = await supabase
            .from('status_incidents')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;
        
        return data.map((inc: any) => ({
            ...inc,
            date: inc.date, // Supabase usually returns ISO strings already
            updates: inc.updates as any
        }));
    } catch (error) {
        console.error("Error fetching incidents:", error);
        return [];
    }
}

export async function addIncident(formData: { title: string, description: string, status: string, date: string }) {
    try {
        const { error } = await supabase
            .from('status_incidents')
            .insert({
                title: formData.title,
                description: formData.description,
                status: formData.status,
                date: new Date(formData.date).toISOString(),
                updates: []
            });
            
        if (error) throw error;
    } catch (error: any) {
        throw new Error(error.message);
    }

    revalidatePath('/status');
    revalidatePath('/admin/status');
}

export async function addIncidentUpdate(incidentId: string, update: { status: string, message: string, date: string }) {
    try {
        // First, get current updates
        const { data: incident, error: fetchError } = await supabase
            .from('status_incidents')
            .select('updates')
            .eq('id', incidentId)
            .single();

        if (fetchError || !incident) throw new Error("Incident not found");

        const currentUpdates = (incident.updates as any[]) || [];
        const newUpdates = [...currentUpdates, { ...update, id: crypto.randomUUID() }];

        const { error: updateError } = await supabase
            .from('status_incidents')
            .update({
                updates: newUpdates,
                status: update.status
            })
            .eq('id', incidentId);
            
        if (updateError) throw updateError;
    } catch (error: any) {
        throw new Error(error.message);
    }

    revalidatePath('/status');
    revalidatePath('/admin/status');
}

export async function deleteIncident(id: string) {
    try {
        const { error } = await supabase
            .from('status_incidents')
            .delete()
            .eq('id', id);
            
        if (error) throw error;
    } catch (error: any) {
        throw new Error(error.message);
    }

    revalidatePath('/status');
    revalidatePath('/admin/status');
}
