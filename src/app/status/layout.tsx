import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'System Status | Reshin.',
    description: 'Real-time system status and incident reporting for Reshin\'s services.',
};

export default function StatusLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
        </>
    );
}
