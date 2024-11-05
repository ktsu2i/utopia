"use client";

import useAuthStore from "@/stores/authStore";

export default function Notifications() {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      {isAuthenticated && (
        <div>Notifications</div>
      )}
    </>
  );
}
