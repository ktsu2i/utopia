"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

const Header = () => {
  return (
    <div className="w-full flex justify-between bg-white border-b border-gray-300 px-10 py-4">
      <Image src="/images/logo.png" height={120} width={120} alt="Utopia" />

      <div className="flex gap-x-2">
        <Button variant="ghost" className="font-semibold">
          <Link href="/login">Login</Link>
        </Button>
        <Button variant="utopia">
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </div>
    </div>
  )
};

export default Header;
