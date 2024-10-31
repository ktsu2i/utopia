"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { TailSpin } from "react-loader-spinner";

import { Button } from "../../../../components/ui/button";
import useAuth from "../../../../hooks/useAuth";

export default function TestHome() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (isAuthenticated === null) {
    return (
      <div className="h-full flex items-center justify-center">
        <TailSpin color="#FF9933" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-5">Home</h1>
      <div className="mb-5">Are you authenticated?: {isAuthenticated ? "Yes" : "No"}</div>
      <div>Only authenticated users can visit <span className="font-bold">demo page</span>.</div>
      <Button type="button" variant="utopia" className="mb-5">
        <Link href="/demo">Go to demo page</Link>
      </Button>
      {isAuthenticated ? (
        <Button onClick={handleLogout}>
          Logout
        </Button>
      ) : (
        <Button>
          <Link href="/sign-up">Sign up</Link>
        </Button>
      )}
    </div>
  );
}
