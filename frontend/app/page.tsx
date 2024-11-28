"use client";

import Features from "@/components/lp/Features";
import Footer from "@/components/lp/Footer";
import Header from "@/components/lp/Header";
import Hero from "@/components/lp/Hero";

export default function Root() {
  return (
    <div className="relative">
      <div className="sticky top-0 z-10">
        <Header />
      </div>
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}
