"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

function VerifyContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState("Verifying...");

    useEffect(() => {
        const verify = async () => {
            const email = searchParams.get('email');
            const token = searchParams.get('token');

            if (!email || !token) {
                setStatus("Invalid Link");
                return;
            }

            try {
                const res = await signIn('credentials', {
                    email,
                    token, // Passing token to custom credentials logic
                    redirect: false
                });

                if (res?.error) {
                    setStatus("Login Failed. Token may be expired.");
                } else {
                    setStatus("Success! Redirecting...");
                    router.push('/admin');
                }
            } catch (e) {
                setStatus("Verification Error");
            }
        };

        verify();
    }, [searchParams, router]);

    return (
        <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-white/50" />
            <h1 className="text-xl font-medium">{status}</h1>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center text-white">
            <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-white/50" />}>
                <VerifyContent />
            </Suspense>
        </div>
    );
}
