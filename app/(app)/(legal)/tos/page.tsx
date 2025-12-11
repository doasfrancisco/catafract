'use client';

import { Navbar } from "@/app/(app)/(landing)/components/Navbar";
import { Footer } from "@/app/(app)/(landing)/components/Footer";

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-[#FDFDFD] font-sans selection:bg-black selection:text-white">
            <Navbar />

            <main className="pt-32 pb-24 px-6">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-normal tracking-tight mb-4">
                        Terms of <span className="font-serif italic font-light">Service</span>
                    </h1>
                    <p className="text-zinc-500 mb-16 text-sm font-mono uppercase tracking-wider">
                        Last updated: December 10, 2025
                    </p>

                    <div className="prose prose-zinc prose-lg dark:prose-invert max-w-none space-y-12">
                        <section>
                            <h2 className="text-2xl font-medium mb-4 text-black">1. Acceptance of Terms</h2>
                            <p className="text-zinc-600 leading-relaxed">
                                By accessing or using Catafract's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-medium mb-4 text-black">2. Use License</h2>
                            <p className="text-zinc-600 leading-relaxed mb-4">
                                We grant you a limited, non-exclusive, non-transferable license to use our services for your personal or internal business purposes, subject to these Terms. You adhere to all applicable laws and regulations.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-medium mb-4 text-black">3. AI Generated Content</h2>
                            <p className="text-zinc-600 leading-relaxed">
                                You retain ownership of the content you generate using our AI tools. However, you grant Catafract a worldwide, royalty-free license to host, copy, and use your content solely for the purpose of providing the service to you.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-medium mb-4 text-black">4. Account Responsibilities</h2>
                            <p className="text-zinc-600 leading-relaxed">
                                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-medium mb-4 text-black">5. Termination</h2>
                            <p className="text-zinc-600 leading-relaxed">
                                We reserve the right to terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <div className="bg-black">
                <Footer />
            </div>
        </div>
    );
}
