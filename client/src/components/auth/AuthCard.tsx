import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

interface AuthCardProps {
    title: string;
    subtitle: string;
    children: ReactNode;
    footerText: string;
    footerLinkText: string;
    footerLinkTo: string;
}

export function AuthCard({
    title,
    subtitle,
    children,
    footerText,
    footerLinkText,
    footerLinkTo,
}: AuthCardProps) {
    return (
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    {title}
                </h1>
                <p className="text-neutral-400">{subtitle}</p>
            </div>

            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 backdrop-blur-sm shadow-xl">
                {children}

                <div className="mt-6 text-center text-sm text-neutral-400">
                    {footerText}{" "}
                    <Link
                        to={footerLinkTo}
                        className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                    >
                        {footerLinkText}
                    </Link>
                </div>
            </div>

            <div className="mt-6 text-center">
                <Link
                    to="/"
                    className="text-neutral-500 hover:text-neutral-400 transition-colors text-sm"
                >
                    ← Back to home
                </Link>
            </div>
        </div>
    );
}
