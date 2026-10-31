"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Copy-to-clipboard with a real fallback.
 *
 * navigator.clipboard is unavailable on insecure origins and can be refused
 * outright, so a rejection selects the address instead and says so. The timer
 * is cleared on unmount, otherwise a fast navigation leaves setState firing
 * against a component that is gone.
 */
export default function CopyEmail({ email }: { email: string }) {
    const [state, setState] = useState<"idle" | "copied" | "selected">("idle");
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => () => {
        if (timer.current) {
            clearTimeout(timer.current);
        }
    }, []);

    function flash(next: "copied" | "selected") {
        setState(next);

        if (timer.current) {
            clearTimeout(timer.current);
        }

        timer.current = setTimeout(() => setState("idle"), 1800);
    }

    function selectAddress() {
        const node = document.getElementById("contact-email");

        if (!node) {
            return;
        }

        try {
            const range = document.createRange();
            range.selectNodeContents(node);
            const selection = window.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(range);
            flash("selected");
        } catch {
            // Selection APIs can be unavailable; nothing useful left to try.
        }
    }

    async function copy() {
        if (!navigator.clipboard?.writeText) {
            selectAddress();
            return;
        }

        try {
            await navigator.clipboard.writeText(email);
            flash("copied");
        } catch {
            selectAddress();
        }
    }

    const label = state === "copied" ? "Copied" : state === "selected" ? "Select it" : "Copy";

    return (
        <button
            type="button"
            onClick={copy}
            className="shrink-0 border border-line-strong px-2.5 py-1.5 font-mono text-label uppercase transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground data-[done=true]:border-primary data-[done=true]:text-primary"
            data-done={state !== "idle"}
        >
            <span aria-hidden="true">{label}</span>
            <span className="sr-only">Copy email address</span>
        </button>
    );
}
