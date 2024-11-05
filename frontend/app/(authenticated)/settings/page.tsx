"use client";

import useAuthStore from "@/stores/authStore";

export default function Settings() {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      {isAuthenticated && (
        <div>Messages</div>
      )}
    </>
  );
}
