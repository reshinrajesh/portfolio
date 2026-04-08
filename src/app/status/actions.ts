"use server";

import { supabase } from "@/lib/supabase";
import { createHulyIssue, updateHulyIssueStatus, createHulyComment, deleteHulyIssue } from "@/lib/huly";
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
        // 1. Create in Huly first (optional but recommended for ID)
        let hulyId = null;
        try {
            const hulyIssue = await createHulyIssue({
                name: "Admin",
                email: "admin@reshinrajesh.in",
                subject: formData.title,
                message: formData.description,
                category: "INCIDENT",
                labels: ["incident", "manual-entry"]
            });
            if (hulyIssue) {
                hulyId = hulyIssue.id;
            }
        } catch (hulyErr) {
            console.warn("Failed to create Huly issue, proceeding with local only:", hulyErr);
        }

        const { error } = await supabase
            .from('status_incidents')
            .insert({
                title: formData.title,
                description: formData.description,
                status: formData.status,
                date: new Date(formData.date).toISOString(),
                updates: [],
                huly_id: hulyId
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
        // First, get current updates and check for huly_id
        const { data: incident, error: fetchError } = await supabase
            .from('status_incidents')
            .select('updates, huly_id')
            .eq('id', incidentId)
            .single();

        if (fetchError || !incident) throw new Error("Incident not found");

        const currentUpdates = (incident.updates as any[]) || [];
        const newUpdates = [...currentUpdates, { ...update, id: crypto.randomUUID() }];

        // Sync to Huly if huly_id exists
        if (incident.huly_id) {
            const hulyStatus = update.status === 'Resolved' || update.status === 'Completed' ? 'DONE' : 'IN_PROGRESS';
            await updateHulyIssueStatus(incident.huly_id, hulyStatus);
            
            // Post the 'message' as a comment to Huly
            if (update.message) {
                await createHulyComment(incident.huly_id, `**Status Update:** ${update.status}\n\n${update.message}`);
            }
        }

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
        // 1. Get huly_id before deleting
        const { data: incident } = await supabase
            .from('status_incidents')
            .select('huly_id')
            .eq('id', id)
            .single();

        if (incident?.huly_id) {
            await deleteHulyIssue(incident.huly_id);
        }

        // 2. Delete from Supabase
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
