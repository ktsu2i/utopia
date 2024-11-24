"use client";

import useAuthStore from "@/stores/authStore";
import { useRouter } from "next/navigation";

export default function Root() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  if (isAuthenticated) {
    router.push("/home");
  }

  return (
    <div>LP</div>
  );
}
