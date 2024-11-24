"use client";

import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon,
  title: string,
  description: string,
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <div className="relative group bg-white shadow-md rounded-xl p-10">
      <Icon className="h-8 w-8 text-utopia" />
      <h3 className="mt-4 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;
