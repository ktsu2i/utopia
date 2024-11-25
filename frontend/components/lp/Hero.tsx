"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { TailSpin } from "react-loader-spinner";

const Hero = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

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

        <div className="relative flex justify-center items-center w-full h-[300px] md:h-[500px]">
          {isLoading && (
            <div className="absolute flex justify-center items-center w-full h-full">
              <TailSpin color="#FF9933" />
            </div>
          )}
          <Image
            src="/images/mockup.svg"
            height={500}
            width={1000}
            alt="Mockup"
            className={`transition-opacity duration-500 ${isLoading ? "opacity-0" : "opacity-100"}`}
            onLoadingComplete={() => setIsLoading(false)}
          />
        </div>

        <Button variant="utopia" size="lg" className="rounded-full mt-10" onClick={onClick}>
          Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Hero;
