"use client";

import useAuthStore from "@/stores/authStore";

export default function Settings() {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      {isAuthenticated && (
        <div>
          <div className="text-2xl font-bold p-6">Settings</div>
        </div>
      )}
    </>
  );
}
