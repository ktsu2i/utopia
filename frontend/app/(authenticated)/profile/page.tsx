"use client";

import useAuthStore from "@/stores/authStore";

const Profile = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      {isAuthenticated && (
        <div>Profile</div>
      )}
    </>
  );
};

export default Profile;
