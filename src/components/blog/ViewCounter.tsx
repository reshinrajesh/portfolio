"use client";

import { useEffect, useRef } from "react";
import { incrementViewCount } from "@/app/actions";
import { Eye } from "lucide-react";

export default function ViewCounter({ id, count }: { id: string, count: number }) {
    const hasIncremented = useRef(false);

    useEffect(() => {
        if (!hasIncremented.current) {
            incrementViewCount(id);
            hasIncremented.current = true;
        }
    }, [id]);

    return (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/30 px-2 py-1 rounded-full border border-border/50">
            <Eye size={12} />
            <span>{count + 1} views</span>
        </div>
    );
}
