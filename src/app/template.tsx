// Route-transition fade. Deliberately CSS, not framer-motion: as a motion
// component this wrapper was server-rendered with `opacity:0` inline, so every
// page stayed invisible until the JS bundle had downloaded and hydrated. The
// keyframes in globals.css start at first paint instead, and honour
// prefers-reduced-motion there.
export default function Template({ children }: { children: React.ReactNode }) {
    return <div className="animate-fade-in">{children}</div>;
}
