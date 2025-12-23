"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import { PlusCircle, Trash2, Edit2, Save, X, GripVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Skill {
    id: string;
    name: string;
    icon: string;
    color: string;
    order: number;
}

export default function SkillsManager() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form states
    const [formData, setFormData] = useState({
        name: "",
        icon: "",
        color: "text-blue-500",
        order: 0
    });

    const fetchSkills = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('skills')
            .select('*')
            .order('order', { ascending: true });

        if (error) {
            console.error('Error fetching skills:', error);
        } else {
            setSkills(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    const resetForm = () => {
        setFormData({ name: "", icon: "", color: "text-blue-500", order: skills.length });
        setIsAdding(false);
        setEditingId(null);
    };

    const handleSave = async () => {
        if (!formData.name || !formData.icon) return;

        if (editingId) {
            // Update
            const { error } = await supabase
                .from('skills')
                .update(formData)
                .eq('id', editingId);

            if (error) console.error('Error updating skill:', error);
        } else {
            // Create
            const { error } = await supabase
                .from('skills')
                .insert([{ ...formData, order: skills.length + 1 }]);

            if (error) console.error('Error creating skill:', error);
        }

        resetForm();
        fetchSkills();
    };

    const handleEdit = (skill: Skill) => {
        setFormData({
            name: skill.name,
            icon: skill.icon,
            color: skill.color,
            order: skill.order
        });
        setEditingId(skill.id);
        setIsAdding(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this skill?")) return;

        const { error } = await supabase
            .from('skills')
            .delete()
            .eq('id', id);

        if (error) console.error('Error deleting skill:', error);
        else fetchSkills();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Skills Management</h2>
                {!isAdding && (
                    <button
                        onClick={() => {
                            resetForm();
                            setIsAdding(true);
                        }}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-all"
                    >
                        <PlusCircle size={18} />
                        Add Skill
                    </button>
                )}
            </div>

            {isAdding && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border p-6 rounded-xl space-y-4"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Skill Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-2 bg-secondary/50 border border-border rounded-lg"
                                placeholder="e.g. React"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Lucide Icon Name</label>
                            <input
                                type="text"
                                value={formData.icon}
                                onChange={e => setFormData({ ...formData, icon: e.target.value })}
                                className="w-full p-2 bg-secondary/50 border border-border rounded-lg"
                                placeholder="e.g. Code2, Database, Layout"
                            />
                            <p className="text-xs text-muted-foreground">Case sensitive. Must match Lucide React icon names.</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tailwind Color Class</label>
                            <input
                                type="text"
                                value={formData.color}
                                onChange={e => setFormData({ ...formData, color: e.target.value })}
                                className="w-full p-2 bg-secondary/50 border border-border rounded-lg"
                                placeholder="e.g. text-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Order</label>
                            <input
                                type="number"
                                value={formData.order}
                                onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                className="w-full p-2 bg-secondary/50 border border-border rounded-lg"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            onClick={resetForm}
                            className="px-4 py-2 text-sm hover:bg-secondary rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-all"
                        >
                            <Save size={16} />
                            Save Skill
                        </button>
                    </div>
                </motion.div>
            )}

            <div className="bg-card/50 border border-border rounded-xl overflow-hidden text-sm"> {/* Reduced text size container */}
                <table className="w-full text-left">
                    <thead className="bg-secondary/50 border-b border-border">
                        <tr>
                            <th className="p-4 font-semibold text-muted-foreground w-12">#</th>
                            <th className="p-4 font-semibold text-muted-foreground">Name</th>
                            <th className="p-4 font-semibold text-muted-foreground">Icon</th>
                            <th className="p-4 font-semibold text-muted-foreground">Color</th>
                            <th className="p-4 font-semibold text-muted-foreground text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {skills.map((skill) => (
                            <tr key={skill.id} className="hover:bg-primary/5 transition-colors">
                                <td className="p-4 text-muted-foreground">{skill.order}</td>
                                <td className="p-4 font-medium">{skill.name}</td>
                                <td className="p-4 font-mono text-xs">{skill.icon}</td>
                                <td className="p-4 font-mono text-xs">
                                    <span className={skill.color}>{skill.color}</span>
                                </td>
                                <td className="p-4 flex justify-end gap-2">
                                    <button
                                        onClick={() => handleEdit(skill)}
                                        className="p-2 hover:bg-secondary text-blue-500 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(skill.id)}
                                        className="p-2 hover:bg-secondary text-red-500 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {skills.length === 0 && !loading && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                    No skills found. Add some to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
