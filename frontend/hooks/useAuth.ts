"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get("http://localhost:8080/api/validate-token", { withCredentials: true });
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
        router.push("/login");
      }
    }

    checkAuth();
  }, [router]);

  const logout = async () => {
    try {
      await axios.post("http://localhost:8080/api/logout", null, { 
        withCredentials: true,
      });
      setIsAuthenticated(false);
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return { isAuthenticated, logout };
}