"use client";

import useAuthStore from "@/stores/authStore";

export default function Search() {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      {isAuthenticated && (
        <div>Search</div>
      )}
    </>
  );
}
