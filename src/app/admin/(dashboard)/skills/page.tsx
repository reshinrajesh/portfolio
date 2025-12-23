import SkillsManager from "@/components/admin/SkillsManager";

export default function SkillsPage() {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Skills</h1>
                <p className="text-muted-foreground mt-1">Manage your technical skills and technologies</p>
            </div>
            <SkillsManager />
        </div>
    );
}
