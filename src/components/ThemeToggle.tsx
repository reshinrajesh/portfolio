"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

/**
 * The resolved theme is only known in the browser, so the control renders a
 * fixed-size placeholder on the server and swaps in the real icon after mount.
 * Sizing it identically in both states is what keeps the readout bar from
 * shifting when hydration lands.
 */
export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();

    useEffect(() => setMounted(true), []);

    const isDark = resolvedTheme === "dark";

    return (
        <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="inline-flex h-6 w-6 items-center justify-center text-muted-foreground transition-colors hover:text-primary"
            aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} theme` : "Switch theme"}
        >
            {mounted ? (
                isDark ? <Sun size={14} aria-hidden="true" /> : <Moon size={14} aria-hidden="true" />
            ) : (
                <span className="block h-[14px] w-[14px]" aria-hidden="true" />
            )}
        </button>
    );
}
