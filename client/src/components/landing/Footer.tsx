import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-neutral-950 border-t border-neutral-800 pt-16 pb-8">
            <div className="container mx-auto px-6 text-center">
                <div className="flex flex-col items-center mb-12">
                    <Link
                        to="/"
                        className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-4"
                    >
                        Helion
                    </Link>
                    <p className="text-neutral-400 mb-8 max-w-md">
                        Empowering the future of communication with advanced AI
                        technology.
                    </p>

                    <div className="flex gap-6 justify-center mb-8">
                        <SocialIcon
                            icon={<Linkedin size={24} />}
                            href="https://www.linkedin.com/in/yahya-salman-37aa29263/"
                            label="LinkedIn"
                        />
                        <SocialIcon
                            icon={<Mail size={24} />}
                            href="mailto:saimyahya47@gmail.com"
                            label="Email"
                        />
                    </div>
                </div>

                <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-center items-center gap-4">
                    <p className="text-neutral-500 text-sm">
                        &copy; {new Date().getFullYear()} Helion. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({
    icon,
    href,
    label,
}: {
    icon: React.ReactNode;
    href: string;
    label: string;
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all hover:scale-110"
            aria-label={label}
        >
            {icon}
        </a>
    );
}
