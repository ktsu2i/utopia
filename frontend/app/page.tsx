"use client";

import Header from "@/components/lp/Header";
import Hero from "@/components/lp/Hero";
import useAuthStore from "@/stores/authStore";
import { useRouter } from "next/navigation";

export default function Root() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  if (isAuthenticated) {
    router.push("/home");
  }

  return (
    <div>
      <Header />
      <Hero />
    </div>
  );
}
