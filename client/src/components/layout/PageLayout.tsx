import type { ReactNode } from "react";

interface PageLayoutProps {
    children: ReactNode;
    className?: string;
}

export function PageLayout({ children, className = "" }: PageLayoutProps) {
    return (
        <div
            className={`min-h-screen bg-neutral-950 text-neutral-50 ${className}`}
        >
            {children}
        </div>
    );
}
