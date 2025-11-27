import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
    {
        question: "What is Helion?",
        answer: "Helion is an advanced AI-powered chat application designed to provide intelligent, fast, and secure conversations. It leverages cutting-edge AI models to assist you with various tasks.",
    },
    {
        question: "Is my data secure?",
        answer: "Yes, absolutely. We prioritize your privacy and security. All conversations are encrypted, and we adhere to strict data protection standards to ensure your information remains confidential.",
    },
    {
        question: "Can I integrate Helion with other tools?",
        answer: "Helion offers seamless integration with a variety of popular tools and platforms, allowing you to streamline your workflow and maximize productivity.",
    },
    {
        question: "Is there a free trial available?",
        answer: "Yes, we offer a free tier that allows you to explore the core features of Helion. You can upgrade to a premium plan anytime to unlock advanced capabilities.",
    },
    {
        question: "How do I get support?",
        answer: "Our dedicated support team is available 24/7 to assist you. You can reach out to us via our support portal or email us directly at support@helion.ai.",
    },
];

export function FAQSection() {
    return (
        <section className="py-24 bg-neutral-900">
            <div className="container mx-auto px-6 max-w-3xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-neutral-400">
                        Everything you need to know about Helion and how it
                        works.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-neutral-800 rounded-lg bg-neutral-950/50 overflow-hidden">
            <button
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-neutral-800/50 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-medium text-lg text-neutral-200">
                    {question}
                </span>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-neutral-400" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-neutral-400" />
                )}
            </button>
            <div
                className={`transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="px-6 pb-4 text-neutral-400 leading-relaxed">
                    {answer}
                </div>
            </div>
        </div>
    );
}
