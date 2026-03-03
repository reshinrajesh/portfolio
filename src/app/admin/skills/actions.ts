"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSkills() {
    try {
        const skills = await prisma.skill.findMany({
            orderBy: { order: 'asc' }
        });
        return skills;
    } catch (error) {
        console.error("Error fetching skills:", error);
        return [];
    }
}

export async function addSkill(skillData: { name: string, icon: string, color: string, order: number }) {
    try {
        await prisma.skill.create({
            data: skillData
        });
        revalidatePath('/'); // Revalidate where skills might be shown
        return { success: true };
    } catch (error: any) {
        console.error("Error adding skill:", error);
        throw new Error(error.message);
    }
}

export async function updateSkill(id: string, skillData: { name: string, icon: string, color: string, order: number }) {
    try {
        await prisma.skill.update({
            where: { id },
            data: skillData
        });
        revalidatePath('/');
        return { success: true };
    } catch (error: any) {
        console.error("Error updating skill:", error);
        throw new Error(error.message);
    }
}

export async function deleteSkill(id: string) {
    try {
        await prisma.skill.delete({
            where: { id }
        });
        revalidatePath('/');
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting skill:", error);
        throw new Error(error.message);
    }
}
