"use client";

import { TailSpin } from "react-loader-spinner";

import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";

export default function Demo() {
  const { isAuthenticated, logout } = useAuth();

  if (isAuthenticated === null) {
    return (
      <div className="h-full flex items-center justify-center">
        <TailSpin color="#FF9933" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-5">Demo page</h1>
      <Button onClick={logout}>Logout</Button>
    </div>
  )
}