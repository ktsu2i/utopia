import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

const Hero = () => {
  return (
    <div className="relative min-h-screen flex justify-center items-center">
      <div className="flex flex-col items-center">
        <h1 className="max-w-7xl text-6xl font-bold tracking-tight text-gray-900">
          Welcome to a <span className="bg-gradient-to-r from-utopia to-purple-600 bg-clip-text text-transparent">Kinder Social Network</span>
        </h1>
        
        <p className="max-w-3xl my-6 text-xl text-gray-600">
          Join a community where positivity thrives, everyone cares for one another, and every interaction makes the world a little brighter.
        </p>

        <Button variant="utopia" size="lg" className="rounded-full">
          Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Hero;
