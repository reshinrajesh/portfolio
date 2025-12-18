"use client";

import { Twitter, Linkedin, Link2, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ShareButtonsProps {
    title: string;
    url?: string; // Optional if we want to rely on window.location
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const getUrl = () => {
        if (typeof window !== "undefined") {
            return url || window.location.href;
        }
        return "";
    };

    const handleShare = (platform: string) => {
        const shareUrl = getUrl();
        const text = `Check out this article: ${title}`;

        let link = "";
        switch (platform) {
            case "twitter":
                link = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
                break;
            case "linkedin":
                link = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
                break;
            case "whatsapp":
                link = `https://wa.me/?text=${encodeURIComponent(text + " " + shareUrl)}`;
                break;
        }

        if (link) {
            window.open(link, "_blank", "noopener,noreferrer");
        }
    };

    const copyToClipboard = () => {
        const shareUrl = getUrl();
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-40 bg-background/80 backdrop-blur-md border border-white/10 p-2 rounded-full flex md:flex-col gap-2 shadow-xl">
            <ShareButton
                icon={Twitter}
                label="Share on X"
                onClick={() => handleShare("twitter")}
                color="hover:text-sky-500"
            />
            <ShareButton
                icon={Linkedin}
                label="Share on LinkedIn"
                onClick={() => handleShare("linkedin")}
                color="hover:text-blue-600"
            />
            <ShareButton
                icon={MessageCircle}
                label="Share on WhatsApp"
                onClick={() => handleShare("whatsapp")}
                color="hover:text-green-500"
            />
            <div className="w-[1px] md:w-full h-full md:h-[1px] bg-border mx-1 md:my-1" />
            <ShareButton
                icon={Link2}
                label="Copy Link"
                onClick={copyToClipboard}
                color={copied ? "text-green-500" : "hover:text-primary"}
            />
        </div>
    );
}

function ShareButton({ icon: Icon, label, onClick, color }: { icon: any, label: string, onClick: () => void, color: string }) {
    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className={cn("p-3 rounded-full hover:bg-secondary/50 transition-colors text-muted-foreground", color)}
            title={label}
        >
            <Icon size={20} />
        </motion.button>
    );
}
