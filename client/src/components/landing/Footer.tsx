import { Link } from "@tanstack/react-router";
import { Github, Twitter, Linkedin, Instagram } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-neutral-950 border-t border-neutral-800 pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link
                            to="/"
                            className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-4 block"
                        >
                            Helion
                        </Link>
                        <p className="text-neutral-400 mb-6">
                            Empowering the future of communication with advanced
                            AI technology.
                        </p>
                        <div className="flex gap-4">
                            <SocialIcon icon={<Twitter size={20} />} href="#" />
                            <SocialIcon icon={<Github size={20} />} href="#" />
                            <SocialIcon
                                icon={<Linkedin size={20} />}
                                href="#"
                            />
                            <SocialIcon
                                icon={<Instagram size={20} />}
                                href="#"
                            />
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-6">
                            Product
                        </h4>
                        <ul className="space-y-4">
                            <FooterLink to="/features">Features</FooterLink>
                            <FooterLink to="/pricing">Pricing</FooterLink>
                            <FooterLink to="/integrations">
                                Integrations
                            </FooterLink>
                            <FooterLink to="/changelog">Changelog</FooterLink>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-6">
                            Company
                        </h4>
                        <ul className="space-y-4">
                            <FooterLink to="/about">About Us</FooterLink>
                            <FooterLink to="/careers">Careers</FooterLink>
                            <FooterLink to="/blog">Blog</FooterLink>
                            <FooterLink to="/contact">Contact</FooterLink>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-6">Legal</h4>
                        <ul className="space-y-4">
                            <FooterLink to="/privacy">
                                Privacy Policy
                            </FooterLink>
                            <FooterLink to="/terms">
                                Terms of Service
                            </FooterLink>
                            <FooterLink to="/security">Security</FooterLink>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-neutral-500 text-sm">
                        &copy; {new Date().getFullYear()} Helion. All rights
                        reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-neutral-500">
                        <a
                            href="#"
                            className="hover:text-white transition-colors"
                        >
                            Privacy
                        </a>
                        <a
                            href="#"
                            className="hover:text-white transition-colors"
                        >
                            Terms
                        </a>
                        <a
                            href="#"
                            className="hover:text-white transition-colors"
                        >
                            Cookies
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
    return (
        <a
            href={href}
            className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all"
        >
            {icon}
        </a>
    );
}

function FooterLink({
    to,
    children,
}: {
    to: string;
    children: React.ReactNode;
}) {
    return (
        <li>
            <Link
                to={to}
                className="text-neutral-400 hover:text-white transition-colors"
            >
                {children}
            </Link>
        </li>
    );
}
