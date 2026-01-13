"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import Link from "next/link";

export default function DecoyPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 max-w-md"
            >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <Lock className="w-10 h-10 text-gray-400" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">System Maintenance</h1>
                <p className="text-gray-500">
                    The admin dashboard is currently undergoing scheduled maintenance. Please try again later.
                </p>
                <div className="pt-8">
                    <Link href="/" className="text-blue-600 hover:underline">
                        Return to Homepage
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
