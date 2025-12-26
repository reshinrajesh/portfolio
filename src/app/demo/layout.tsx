import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Demo | Reshin Rajesh',
    description: 'Experimental features and testing ground.',
    robots: {
        index: false,
        follow: false,
    },
};

export default function DemoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="demo-layout antialiased">
            <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 z-50 opacity-50" />
            <div className="fixed top-2 right-2 z-50">
                <span className="px-2 py-1 text-[10px] font-mono uppercase bg-orange-500/20 text-orange-500 border border-orange-500/30 rounded">
                    DEMO ENV
                </span>
            </div>
            {children}
        </div>
    );
}
