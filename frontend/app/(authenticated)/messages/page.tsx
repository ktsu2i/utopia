"use client";

import useAuthStore from "@/stores/authStore";

export default function Messages() {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      {isAuthenticated && (
        <div className="text-2xl font-bold border-b border-gray-300 p-4">Messages</div>
      )}
    </>
  );
}
