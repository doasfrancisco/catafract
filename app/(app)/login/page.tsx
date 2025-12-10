'use client';

import Image from "next/image";
import { signIn } from 'next-auth/react';

export default function LoginPage() {
    return (
        <div className="relative min-h-screen flex bg-white text-black font-sans">
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                <Image
                    src="/assets/background-2.svg"
                    alt="Background pattern"
                    fill
                    className="object-cover translate-x-1/2"
                    priority
                />
            </div>
            {/* Left Side - Image & Text */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-black items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/assets/outlaw.png"
                        alt="outlaw"
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/20" />
                </div>

                <div className="relative z-10 max-w-lg px-8 text-center text-white">
                    <h2 className="text-4xl font-serif font-medium mb-6 leading-tight">
                        Everything you need,<br />
                        to make anything you want.
                    </h2>
                    <p className="text-lg text-gray-200 font-light">
                        Dozens of creative tools to ideate, generate and edit content like never before.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="z-10 w-full lg:w-1/2 flex flex-col items-center p-8">
                <div className="w-full max-w-md flex-1 flex flex-col justify-center">
                    <div className="flex justify-center mb-8">
                        <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                            {/* Placeholder for Logo */}
                            <Image
                                src="/assets/logo.svg"
                                alt="Logo"
                                width={36}
                                height={36}
                            />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-center mb-2">
                        Welcome to Catafract
                    </h1>
                    <p className="text-center text-gray-500 mb-8">Log in or sign up</p>

                    <div className="space-y-4">
                        <button
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 hover:bg-gray-50 transition-colors hover:cursor-pointer"
                            onClick={() => signIn('google', { callbackUrl: '/projects' })}
                        >
                            {/* Google Icon SVG */}
                            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            <span className="font-medium">Continue with Google</span>
                        </button>

                        {/* <div className="relative flex items-center justify-center">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <span className="relative bg-white px-4 text-sm text-gray-400">
                                OR
                            </span>
                        </div> */}

                        {/* <div className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                />
                            </div>

                            <Link
                                href="/projects"
                                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Continue with Email &rarr;
                            </Link>
                        </div> */}
                    </div>

                </div>

                <div className="w-full max-w-md">
                    <p className="text-center text-xs text-gray-400">
                        By signing up, you agree to our
                        <br />
                        <a href="#" className="underline hover:text-gray-600">
                            Terms of Service
                        </a>{" "}
                        &{" "}
                        <a href="#" className="underline hover:text-gray-600">
                            Privacy Policy
                        </a>
                    </p>
                </div>
            </div>
        </div >
    );
}