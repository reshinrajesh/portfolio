"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getSkills() {
    try {
        const { data: skills, error } = await supabase
            .from('skills')
            .select('*')
            .order('order', { ascending: true });
            
        if (error) throw error;
        return skills;
    } catch (error) {
        console.error("Error fetching skills:", error);
        return [];
    }
}

export async function addSkill(skillData: { name: string, icon: string, color: string, order: number }) {
    try {
        const { error } = await supabase
            .from('skills')
            .insert(skillData);
            
        if (error) throw error;
        revalidatePath('/'); // Revalidate where skills might be shown
        return { success: true };
    } catch (error: any) {
        console.error("Error adding skill:", error);
        throw new Error(error.message);
    }
}

export async function updateSkill(id: string, skillData: { name: string, icon: string, color: string, order: number }) {
    try {
        const { error } = await supabase
            .from('skills')
            .update(skillData)
            .eq('id', id);
            
        if (error) throw error;
        revalidatePath('/');
        return { success: true };
    } catch (error: any) {
        console.error("Error updating skill:", error);
        throw new Error(error.message);
    }
}

export async function deleteSkill(id: string) {
    try {
        const { error } = await supabase
            .from('skills')
            .delete()
            .eq('id', id);
            
        if (error) throw error;
        revalidatePath('/');
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting skill:", error);
        throw new Error(error.message);
    }
}
