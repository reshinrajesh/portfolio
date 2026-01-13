"use client";

import { useState } from 'react';
import { Fingerprint } from 'lucide-react';

export function PasskeyManager() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleRegister = async () => {
        setStatus('loading');
        try {
            // 1. Get Options
            const res = await fetch('/api/auth/passkey/register/options');
            if (!res.ok) {
                const err = await res.json();
                alert(`Error: ${err.error}`);
                setStatus('error');
                return;
            }
            const options = await res.json();

            // 2. Start Ceremony
            const { startRegistration } = await import('@simplewebauthn/browser');
            const attResp = await startRegistration(options);

            // 3. Verify
            const verifyRes = await fetch('/api/auth/passkey/register/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(attResp),
            });

            if (verifyRes.ok) {
                setStatus('success');
                alert("Passkey registered successfully!");
            } else {
                setStatus('error');
                alert("Verification failed.");
            }
        } catch (e) {
            console.error(e);
            setStatus('error');
            alert("Registration failed");
        } finally {
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <div className="bg-black border border-white/10 p-6 rounded-lg font-mono relative overflow-hidden group">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <Fingerprint className="text-blue-400" />
                Passkey Management
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
                Register this device as a passkey authenticator for passwordless login.
            </p>
            <button
                onClick={handleRegister}
                disabled={status === 'loading'}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-sm transition-colors disabled:opacity-50"
            >
                {status === 'loading' ? 'Registering...' : status === 'success' ? 'Registered!' : 'Register New Passkey'}
            </button>
        </div>
    );
}
