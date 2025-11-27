import { Zap, Globe, Cpu, Database, MessageSquare, Shield } from "lucide-react";

export function IntegrationsSection() {
    return (
        <section className="py-24 bg-neutral-950 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-900/20 rounded-full blur-[80px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-2 bg-purple-500/10 rounded-xl mb-4">
                        <Zap className="w-5 h-5 text-purple-400 mr-2" />
                        <span className="text-purple-400 font-medium">
                            Seamless Integration
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                        Optimize Generate with favorite
                        <br />
                        tool integration
                    </h2>
                    <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
                        Connect Helion with your existing workflow.
                        Auto-generate content, sync data, and streamline your
                        operations with our powerful integrations.
                    </p>
                </div>

                <div className="relative w-full max-w-4xl mx-auto aspect-[16/9] md:aspect-[2/1] flex items-center justify-center">
                    {/* Connecting Lines (SVG) */}
                    <svg
                        className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
                        viewBox="0 0 800 400"
                    >
                        {/* Center to Top Left */}
                        <path
                            d="M400 200 L200 100"
                            stroke="url(#line-gradient)"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                        />
                        {/* Center to Top Right */}
                        <path
                            d="M400 200 L600 100"
                            stroke="url(#line-gradient)"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                        />
                        {/* Center to Middle Left */}
                        <path
                            d="M400 200 L150 200"
                            stroke="url(#line-gradient)"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                        />
                        {/* Center to Middle Right */}
                        <path
                            d="M400 200 L650 200"
                            stroke="url(#line-gradient)"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                        />
                        {/* Center to Bottom Left */}
                        <path
                            d="M400 200 L200 300"
                            stroke="url(#line-gradient)"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                        />
                        {/* Center to Bottom Right */}
                        <path
                            d="M400 200 L600 300"
                            stroke="url(#line-gradient)"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                        />

                        <defs>
                            <linearGradient
                                id="line-gradient"
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="0%"
                            >
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#a855f7" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Center Node */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
                            <div className="w-24 h-24 rounded-full bg-neutral-900 border-2 border-purple-500/50 flex items-center justify-center relative z-10 shadow-2xl shadow-purple-900/50">
                                <Zap className="w-10 h-10 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Surrounding Nodes */}
                    <IntegrationNode
                        icon={<Globe />}
                        label="Web"
                        position="top-20 left-[20%] md:left-[25%]"
                        delay="0s"
                    />
                    <IntegrationNode
                        icon={<Cpu />}
                        label="AI Models"
                        position="top-20 right-[20%] md:right-[25%]"
                        delay="1s"
                    />
                    <IntegrationNode
                        icon={<Database />}
                        label="Data"
                        position="top-1/2 -translate-y-1/2 left-[5%] md:left-[15%]"
                        delay="2s"
                    />
                    <IntegrationNode
                        icon={<MessageSquare />}
                        label="Chat"
                        position="top-1/2 -translate-y-1/2 right-[5%] md:right-[15%]"
                        delay="3s"
                    />
                    <IntegrationNode
                        icon={<Shield />}
                        label="Security"
                        position="bottom-20 left-[20%] md:left-[25%]"
                        delay="4s"
                    />
                    <IntegrationNode
                        icon={<Zap />}
                        label="Automation"
                        position="bottom-20 right-[20%] md:right-[25%]"
                        delay="5s"
                    />
                </div>
            </div>
        </section>
    );
}

function IntegrationNode({
    icon,
    label,
    position,
    delay,
}: {
    icon: React.ReactNode;
    label: string;
    position: string;
    delay: string;
}) {
    return (
        <div
            className={`absolute ${position} flex flex-col items-center gap-2 animate-float`}
            style={{ animationDelay: delay }}
        >
            <div className="w-16 h-16 rounded-full bg-neutral-900/80 border border-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white hover:border-purple-500/50 hover:bg-neutral-800 transition-all duration-300 shadow-lg backdrop-blur-sm">
                {icon}
            </div>
            <span className="text-sm font-medium text-neutral-500">
                {label}
            </span>
        </div>
    );
}
