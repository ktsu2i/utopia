"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MobileHeader = () => {
  const pathname = usePathname();

  return (
    <div className={`fixed top-0 left-0 z-20 h-16 w-full bg-white border-b border-gray-300 p-4 flex items-center justify-center md:hidden ${pathname !== "/home" && "hidden"}`}>
      <Link href="/home">
        <Image src="/images/logo-square.png" height={45} width={45} alt="Utopia" />
      </Link>
    </div>
  );
};

export default MobileHeader;
