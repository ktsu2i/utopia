"use client";

import { User } from "@/lib/types";
import useAuthStore from "@/stores/authStore";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useAuth() {
  const pathname = usePathname();
  const router = useRouter();
  const { setIsAuthenticated, setCurrentUser } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get<User>("http://localhost:8080/api/validate-token", { withCredentials: true })
          .then((res) => {
            setIsAuthenticated(true);
            setCurrentUser(res.data);
          });
      } catch {
        setIsAuthenticated(false);
        setCurrentUser(null);
        router.push("/login");
      }
    }

    checkAuth();
  }, [pathname, router, setIsAuthenticated, setCurrentUser]);

  const logout = async () => {
    try {
      await axios.post("http://localhost:8080/api/logout", null, { 
        withCredentials: true,
      });

      setIsAuthenticated(false);
      setCurrentUser(null);
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return { logout };
}