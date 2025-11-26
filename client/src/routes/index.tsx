import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
    component: HomePage,
});

function HomePage() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            ChatApp
                        </h1>
                        <nav className="flex gap-4">
                            <Link
                                to="/login"
                                className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors"
                            >
                                Sign Up
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

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
                        <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 backdrop-blur-sm hover:border-neutral-700 transition-colors">
                            <div className="text-4xl mb-4">⚡</div>
                            <h3 className="text-xl font-semibold mb-2">
                                Lightning Fast
                            </h3>
                            <p className="text-neutral-400">
                                Get instant responses powered by cutting-edge AI
                                technology
                            </p>
                        </div>
                        <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 backdrop-blur-sm hover:border-neutral-700 transition-colors">
                            <div className="text-4xl mb-4">🎨</div>
                            <h3 className="text-xl font-semibold mb-2">
                                Beautiful Design
                            </h3>
                            <p className="text-neutral-400">
                                Enjoy a sleek, modern interface that's a
                                pleasure to use
                            </p>
                        </div>
                        <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 backdrop-blur-sm hover:border-neutral-700 transition-colors">
                            <div className="text-4xl mb-4">🔒</div>
                            <h3 className="text-xl font-semibold mb-2">
                                Secure & Private
                            </h3>
                            <p className="text-neutral-400">
                                Your conversations are encrypted and completely
                                private
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-neutral-800 py-6">
                <div className="container mx-auto px-6 text-center text-neutral-500">
                    <p>&copy; 2025 ChatApp. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
