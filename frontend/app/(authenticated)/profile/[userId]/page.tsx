"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/types";
import useAuthStore from "@/stores/authStore";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function UserProfilePage() {
  const { userId } = useParams();
  const { isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get<User>(`http://localhost:8080/api/users/${userId}`, {
          withCredentials: true
        });
        setUser(res.data);
      } catch {
        setUser(null);
      }
    };

    fetchUser();

    const socket = new WebSocket("ws://localhost:8080/api/ws");

    socket.onmessage = (event) => {
      if (event.data === "follow" || event.data === "unfollow") {
        fetchUser();
      }
    };

    return () => {
      socket.close();
    }
  }, [userId]);

  const handleFollow = async () => {
    try {
      setIsLoading(true);
      if (user?.isFollowing) {
        await axios.delete(`http://localhost:8080/api/followers/${user?.id}`, { withCredentials: true });
      } else {
        await axios.post(`http://localhost:8080/api/followers/${user?.id}`, null, { withCredentials: true });
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {isAuthenticated && (
        <div>
          <div className="flex items-center gap-5 p-6 mb-2">
            <div onClick={() => router.back()} className="p-1 rounded-full hover:bg-utopia_light hover:text-utopia">
              <ArrowLeft />
            </div>
            <div className="font-bold text-xl">Profile</div>
          </div>
          
          <div className="flex flex-col justify-center gap-y-4">
            <div className="flex justify-center mt-10">
              <Avatar className="h-28 w-28">
                <AvatarFallback className="text-2xl">
                  {user?.accountName.substring(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold">
                {user?.accountName}
              </span>
              <div className="text-gray-500">
                {"@" + user?.username}
              </div>
            </div>
            <div className="flex justify-center gap-x-4">
              <div>
                <span className="font-bold">{user?.followingCount}</span> following
              </div>
              <div>
                <span className="font-bold">{user?.followedCount}</span> followers
              </div>
            </div>
            <div className={`justify-center mx-20 my-4 whitespace-pre-wrap ${!user?.bio && "hidden"}`}>
              {user?.bio}
            </div>

            <div className="flex justify-center gap-x-2">
              {user?.isFollowing ? (
                <Button onClick={handleFollow}>Unfollow</Button>
              ) : (
                <Button variant="utopia" onClick={handleFollow}>Follow</Button>
              )}
              <Button variant="outline">Message</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}