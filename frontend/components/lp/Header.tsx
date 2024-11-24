"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

const Header = () => {
  return (
    <div className="w-full flex justify-between bg-white border-b border-gray-300 px-4 py-4 md:px-10">
      <Image src="/images/logo.png" height={120} width={120} alt="Utopia" className="hidden md:block" />
      <Image src="/images/logo-square.png" height={40} width={40} alt="Utopia" className="md:hidden" />

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
