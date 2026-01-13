"use client";

import { motion, useSpring, useTransform, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

interface CountingNumberProps {
    value: number;
    duration?: number;
    className?: string;
    prefix?: string;
    suffix?: string;
    decimals?: number;
}

export default function CountingNumber({
    value,
    duration = 2,
    className = "",
    prefix = "",
    suffix = "",
    decimals = 0
}: CountingNumberProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    const spring = useSpring(0, {
        stiffness: 50,
        damping: 15,
        duration: duration * 1000
    });

    const display = useTransform(spring, (current) => {
        return `${prefix}${current.toFixed(decimals)}${suffix}`;
    });

    useEffect(() => {
        if (isInView) {
            spring.set(value);
        }
    }, [spring, value, isInView]);

    return <motion.span ref={ref} className={className}>{display}</motion.span>;
}
