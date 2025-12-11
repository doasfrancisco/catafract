'use client';

import { Navbar } from "@/app/(app)/(landing)/components/Navbar";
import { Footer } from "@/app/(app)/(landing)/components/Footer";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[#FDFDFD] font-sans selection:bg-black selection:text-white">
            <Navbar />

            <main className="pt-32 pb-24 px-6">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-normal tracking-tight mb-4">
                        Privacy <span className="font-serif italic font-light">Policy</span>
                    </h1>
                    <p className="text-zinc-500 mb-16 text-sm font-mono uppercase tracking-wider">
                        Last updated: December 10, 2025
                    </p>

                    <div className="prose prose-zinc prose-lg dark:prose-invert max-w-none space-y-12">
                        <section>
                            <h2 className="text-2xl font-medium mb-4 text-black">1. Introduction</h2>
                            <p className="text-zinc-600 leading-relaxed">
                                Catafract ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-medium mb-4 text-black">2. Information We Collect</h2>
                            <p className="text-zinc-600 leading-relaxed mb-4">
                                We collect information that you provide directly to us, including:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-zinc-600">
                                <li>Account information (name, email, password)</li>
                                <li>Content you upload or generate using our AI tools</li>
                                <li>Usage data and interaction with our services</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-medium mb-4 text-black">3. How We Use Your Information</h2>
                            <p className="text-zinc-600 leading-relaxed">
                                We use the collected information to providing, maintain, and improve our services, communicate with you, and ensure the security of our platform. We do not sell your personal data to third parties.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-medium mb-4 text-black">4. Data Security</h2>
                            <p className="text-zinc-600 leading-relaxed">
                                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-medium mb-4 text-black">5. Contact Us</h2>
                            <p className="text-zinc-600 leading-relaxed">
                                If you have any questions about this Privacy Policy, please contact us at privacy@catafract.com.
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