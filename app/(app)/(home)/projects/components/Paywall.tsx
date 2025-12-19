'use client';

import { useState } from 'react';
import { Check, Circle, Disc } from 'lucide-react';
import { useUserStore } from '@/app/store/useUserStore';

export default function Paywall() {
    const [billingCycle, setBillingCycle] = useState('');
    const { userData } = useUserStore();

    const features = [
        "Full access to canvas",
        "Generate images using Nanobana Pro",
        "Remove watermarks",
        "Buy more credits as needed"
    ];

    const handleUpgrade = () => {
        if (!userData) return;
        let productId = 'e1c52c1a-e8e0-4340-bda2-7cfb368f74ae';
        if (process.env.NEXT_PUBLIC_SETUP === "local") {
            productId = '4546a385-edca-4363-937e-48a88413bedb';
        }

        const params = new URLSearchParams();
        params.append('products', productId);

        if (userData?.id) params.append('customerExternalId', userData.id);
        if (userData?.email) params.append('customerEmail', userData.email);
        if (userData?.name) params.append('customerName', userData.name);

        window.location.href = `/api/checkout?${params.toString()}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
            {/* <div className="w-full max-w-4xl h-[450px] bg-gradient-to-tr from-white via-gray-100 to-gray-400 rounded-3xl shadow-2xl overflow-hidden border border-white/50 flex flex-col lg:flex-row"> */}
            {/* <div className="w-full max-w-4xl h-[450px] bg-gradient-to-tr from-white via-gray-100 to-gray-400 rounded-3xl shadow-2xl overflow-hidden border border-white/50 flex flex-col lg:flex-row"> */}

            <div
                className="w-full max-w-4xl h-auto lg:h-[450px] rounded-3xl shadow-2xl overflow-hidden border border-white/50 flex flex-col lg:flex-row bg-cover bg-center"
                style={{ backgroundImage: "url('/assets/paywall_background.svg')" }}
            >
                {/* Left Side: Features */}
                <div className="flex-1 p-8 lg:p-12">
                    <h2 className="text-4xl font-medium text-gray-900 mb-8">Get Catafract</h2>
                    <ul className="space-y-4">
                        {features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-gray-800">
                                <div className="mt-0.5 min-w-[16px]">
                                    <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center">
                                        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                    </div>
                                </div>
                                <span className="leading-tigh text-base">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Side: Pricing */}
                <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center gap-4">

                    {/* Yearly Option */}
                    {/* <div
                        onClick={() => setBillingCycle('yearly')}
                        className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${billingCycle === 'yearly'
                            ? 'border-black bg-white shadow-sm'
                            : 'border-transparent hover:bg-white/50'
                            }`}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="font-medium text-gray-900">Yearly</div>
                                <div className="text-xs text-gray-500 mt-0.5">Billed yearly as $144</div>
                            </div>
                            <div className="text-right">
                                <div className="font-medium text-gray-900">$12 per editor</div>
                                <div className="text-xs text-gray-500">/month</div>
                            </div>
                        </div>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 ml-4">
                            {billingCycle === 'yearly'
                                ? <Disc className="w-5 h-5 text-black fill-current" />
                                : <Circle className="w-5 h-5 text-gray-300" />
                            }
                        </div>
                    </div> */}

                    {/* Monthly Option */}
                    <div
                        onClick={() => setBillingCycle('monthly')}
                        className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${billingCycle === 'monthly'
                            ? 'border-gray-500 shadow-sm'
                            : 'border-gray-300 hover:bg-white/50'
                            }`}
                    >
                        <div className="flex justify-between items-center pr-8">
                            <div>
                                <div className="font-medium text-gray-900">Monthly</div>
                            </div>
                            <div className="text-right">
                                <div className="font-normal text-sm text-gray-900">$20</div>
                                <div className="text-base text-gray-500">/month</div>
                            </div>
                        </div>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            {billingCycle === 'monthly'
                                ? <Disc className="w-5 h-5 text-black fill-current" />
                                : <Circle className="w-5 h-5 text-gray-300" />
                            }
                        </div>
                    </div>

                    <button
                        onClick={handleUpgrade}
                        className={
                            `w-full mt-4 bg-black text-white py-3.5 rounded-lg font-medium hover:bg-gray-900 hover:cursor-pointer transition-colors
                            ${billingCycle === 'monthly' ? '' : 'invisible'}`
                        }
                    >
                        Get started
                    </button>
                </div>
            </div>
        </div >
    );
}