"use client";

import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";

export default function Home() {
  const { isAuthenticated, logout } = useAuth();

  if (isAuthenticated === null) {
    return <div>Loading...</div>
  }

  return (
    <>
      <h1>Home</h1>
      <div>Are you isAuthenticated?: {isAuthenticated ? "Yes" : "No"}</div>
      <Button onClick={logout}>Logout</Button>
    </>
  );
}
