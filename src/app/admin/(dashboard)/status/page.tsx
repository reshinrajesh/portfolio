import { getIncidents } from "@/app/status/actions";
import StatusClient from "./StatusClient";

export const metadata = {
    title: "System Status | Admin",
};

export default async function AdminStatusPage() {
    const incidents = await getIncidents();

    return <StatusClient initialIncidents={incidents} />;
}
