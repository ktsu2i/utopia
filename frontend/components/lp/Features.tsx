"use client";

import { Bot, Heart, Lock, MessageCircle, Shield, Sparkles, User, Users } from "lucide-react";
import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: Bot,
    title: 'Utopia AI',
    description: 'Utopia AI always checks if contents are appropriate before users post, reply, and text others.'
  },
  {
    icon: Shield,
    title: 'Safe Environment',
    description: 'Enjoy a positive and inclusive space where everyone feels protected and supported.'
  },
  {
    icon: Sparkles,
    title: 'Daily Inspiration',
    description: 'Discover content that motivates and inspires you every day.'
  },
  {
    icon: Heart,
    title: 'Positivity in Action',
    description: 'Experience the joy of sharing positivity and encouraging others every step of the way.'
  },
  {
    icon: Users,
    title: 'Supportive Community',
    description: 'Stay connected with supportive users and support each other.'
  },
  {
    icon: User,
    title: 'Genuine Self',
    description: 'Utopia is the place where you can truly be yourself. Utopia prevents you from any harmful content.'
  }
];

const Features = () => {
  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 sm:text-4xl">
          A Better Way to Connect
        </h2>
        <p className="mt-4 text-xl text-center text-gray-900">
          Experience social media as it should be - positive, supportive, and meaningful.
        </p>
        <div className="grid grid-cols-1 gap-8 mt-20 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <FeatureCard key={i} icon={feature.icon} title={feature.title} description={feature.description} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
