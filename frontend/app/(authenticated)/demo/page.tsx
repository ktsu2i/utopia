"use client";

import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";

export default function Demo() {
  const { isAuthenticated, logout } = useAuth();

  if (isAuthenticated === null) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) return null;

  return (
    <>
      <h1>Demo page</h1>
      <Button onClick={logout}>Logout</Button>
    </>
  )
}