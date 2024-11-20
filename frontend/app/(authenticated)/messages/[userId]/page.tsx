"use client";

import { User } from "@/lib/types";
import useAuthStore from "@/stores/authStore";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChatPage() {
  const { userId } = useParams();
  const { isAuthenticated } = useAuthStore();
  const [user, setUser] = useState<User | null>(null);

  // fetch user
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get<User>(`http://localhost:8080/api/users/${userId}`, { withCredentials: true });
      setUser(res.data);
    };

    fetchUser();
  }, [userId]);
  
  return (
    <>
      {isAuthenticated && (
        <div className="relative h-screen">
          <div className="text-2xl font-bold border-b border-gray-300 p-6">
            {user?.accountName}
          </div>
        </div>
      )}
    </>
  );
}