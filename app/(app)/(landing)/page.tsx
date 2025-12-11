'use client';

import Image from "next/image";
import { useRef } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Mission } from "./components/Mission";
import { Content } from "./components/Content";
import { Footer } from "./components/Footer";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: mainScroll } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  const patternOpacity = useTransform(mainScroll, [0, 0.3], [1, 0]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#FDFDFD] font-sans">
      <motion.div
        style={{ opacity: patternOpacity }}
        className="fixed inset-0 w-full h-full pointer-events-none"
      >
        <Image
          src="/assets/background.svg"
          alt="Background pattern"
          fill
          className="object-cover"
          priority
        />
      </motion.div >

      <Navbar />
      <Hero />
      <Mission />
      <Content />
      <Footer />
    </div >
  );
}
