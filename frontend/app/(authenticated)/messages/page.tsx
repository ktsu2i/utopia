"use client";

import useAuthStore from "@/stores/authStore";

export default function Messages() {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      {isAuthenticated && (
        <div>Messages</div>
      )}
    </>
  );
}
