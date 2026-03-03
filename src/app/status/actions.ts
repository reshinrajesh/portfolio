"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getIncidents() {
    try {
        const data = await prisma.statusIncident.findMany({
            orderBy: { date: 'desc' }
        });
        return data.map((inc: any) => ({
            ...inc,
            date: inc.date.toISOString(),
            updates: inc.updates as any
        }));
    } catch (error) {
        console.error("Error fetching incidents:", error);
        return [];
    }
}

export async function addIncident(formData: { title: string, description: string, status: string, date: string }) {
    try {
        await prisma.statusIncident.create({
            data: {
                title: formData.title,
                description: formData.description,
                status: formData.status,
                date: new Date(formData.date),
                updates: [] // Initial empty updates
            }
        });
    } catch (error: any) {
        throw new Error(error.message);
    }

    revalidatePath('/status');
    revalidatePath('/admin/status');
}

export async function addIncidentUpdate(incidentId: string, update: { status: string, message: string, date: string }) {
    try {
        // First, get current updates
        const incident = await prisma.statusIncident.findUnique({
            where: { id: incidentId },
            select: { updates: true }
        });

        if (!incident) throw new Error("Incident not found");

        const currentUpdates = (incident.updates as any[]) || [];
        const newUpdates = [...currentUpdates, { ...update, id: crypto.randomUUID() }];

        await prisma.statusIncident.update({
            where: { id: incidentId },
            data: {
                updates: newUpdates,
                status: update.status
            }
        });
    } catch (error: any) {
        throw new Error(error.message);
    }

    revalidatePath('/status');
    revalidatePath('/admin/status');
}

export async function deleteIncident(id: string) {
    try {
        await prisma.statusIncident.delete({
            where: { id }
        });
    } catch (error: any) {
        throw new Error(error.message);
    }

    revalidatePath('/status');
    revalidatePath('/admin/status');
}
