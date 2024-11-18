"use client";

import useAuthStore from "@/stores/authStore";
import ProfileHeader from "./_components/Header";

const Profile = () => {
  const { isAuthenticated, currentUser } = useAuthStore();

  return (
    <>
      {isAuthenticated && (
        <ProfileHeader />
      )}
    </>
  );
};

export default Profile;
