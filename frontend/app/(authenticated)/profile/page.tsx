"use client";

import useAuthStore from "@/stores/authStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Profile = () => {
  const router = useRouter();
  const { isAuthenticated, currentUser } = useAuthStore();

  return (
    <>
      {isAuthenticated && (
        <div>
          <div className="text-2xl font-bold p-6">Profile</div>
          
          <div className="flex flex-col justify-center gap-y-4">
            <div className="flex justify-center mt-10">
              <Avatar className="h-28 w-28">
                <AvatarFallback className="text-2xl">
                  {currentUser?.accountName.substring(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold">
                {currentUser?.accountName}
              </span>
              <div className="text-gray-500">
                {"@" + currentUser?.username}
              </div>
            </div>
            <div className="flex justify-center gap-x-4">
              <div>
                <span className="font-bold">10</span> following
              </div>
              <div>
                <span className="font-bold">10</span> followers
              </div>
            </div>
            <div className="justify-center mx-20 my-4 whitespace-pre-wrap">
              {currentUser?.bio ? currentUser?.bio : "Add your bio!"}
            </div>
            <div className="flex justify-center">
              <Button variant="outline" onClick={() => router.push("/profile/edit")}>Edit profile</Button>
              {/* <Button variant="outline">??</Button> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
