"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();

  const onClick = () => {
    router.push("/sign-up");
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center">
      <div className="text-center">
        <div className="max-w-7xl text-4xl px-2 md:text-6xl font-bold tracking-tight text-gray-900">
          <span className="block lg:inline">Welcome to a</span>{" "} 
          <span className="bg-gradient-to-r from-utopia to-purple-600 bg-clip-text text-transparent">
            Kinder Social Network
          </span>
        </div>

        <p className="max-w-3xl mx-auto my-6 px-4 md:px-0 md:text-xl text-gray-600">
          Join a community where positivity thrives, everyone cares for one another, and every interaction makes the world a little brighter.
        </p>

        <Button variant="utopia" size="lg" className="rounded-full" onClick={onClick}>
          Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Hero;
