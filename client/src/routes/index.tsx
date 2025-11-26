import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout } from "../components/layout/PageLayout";
import { Header } from "../components/layout/Header";

export const Route = createFileRoute("/")({
    component: HomePage,
});

function HomePage() {
    return (
        <PageLayout className="flex flex-col">
            <Header />

            {/* Hero Section */}
            <main className="flex-1 flex items-center justify-center">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        Welcome to ChatApp
                    </h2>
                    <p className="text-xl text-neutral-400 mb-12 max-w-2xl mx-auto">
                        Experience the next generation of AI-powered
                        conversations. Intelligent, fast, and beautifully
                        designed.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            to="/chats"
                            className="px-8 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all transform hover:scale-105 font-semibold text-lg shadow-lg shadow-blue-500/50"
                        >
                            Start Chatting
                        </Link>
                        <Link
                            to="/signup"
                            className="px-8 py-4 rounded-lg border-2 border-neutral-700 hover:border-neutral-600 transition-colors font-semibold text-lg"
                        >
                            Learn More
                        </Link>
                    </div>

                    {/* Feature Cards */}
                    <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
                        <FeatureCard
                            icon="⚡"
                            title="Lightning Fast"
                            description="Get instant responses powered by cutting-edge AI technology"
                        />
                        <FeatureCard
                            icon="🎨"
                            title="Beautiful Design"
                            description="Enjoy a sleek, modern interface that's a pleasure to use"
                        />
                        <FeatureCard
                            icon="🔒"
                            title="Secure & Private"
                            description="Your conversations are encrypted and completely private"
                        />
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-neutral-800 py-6">
                <div className="container mx-auto px-6 text-center text-neutral-500">
                    <p>&copy; 2025 ChatApp. All rights reserved.</p>
                </div>
            </footer>
        </PageLayout>
    );
}

function FeatureCard({
    icon,
    title,
    description,
}: {
    icon: string;
    title: string;
    description: string;
}) {
    return (
        <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 backdrop-blur-sm hover:border-neutral-700 transition-colors">
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-neutral-400">{description}</p>
        </div>
    );
}
