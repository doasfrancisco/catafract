import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#FDFDFD] dark:bg-black font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black overflow-hidden">
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <Image
          src="/assets/background.svg"
          alt="Background pattern"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="relative z-10">
        <div className="hidden lg:block">
          <Navbar />
        </div>
        <main className="flex flex-col items-center justify-center">
          <Hero />
        </main>
      </div>
    </div>
  );
}
