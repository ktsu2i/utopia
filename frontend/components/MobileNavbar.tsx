import useNotificationStore from "@/stores/notificationStore";
import { Bell, Home, Mail, Search, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MobileNavbar = () => {
  const pathname = usePathname();
  const { hasNewNotification } = useNotificationStore();

  const routes = [
    {
      icon: Home,
      href: "/home",
      active: pathname === "/home",
    },
    {
      icon: Search,
      href: "/search",
      active: pathname === "/search",
    },
    {
      icon: Bell,
      href: "/notifications",
      active: pathname === "/notifications",
    },
    {
      icon: Mail,
      href: "/messages",
      active: pathname.startsWith("/messages"),
    },
    {
      icon: User,
      href: "/profile",
      active: pathname.startsWith("/profile"),
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-20 w-full bg-white border-t border-gray-300 md:hidden">
      <div className="flex justify-around p-4">
        {routes.map((route) => (
          <Link key={route.href} href={route.href} className="relative">
            <route.icon size={24} strokeWidth={route.active ? 2.5 : 2} />
            {route.href === "/notifications" && hasNewNotification && (
              <span className="absolute top-0 right-0 bg-utopia rounded-full w-2.5 h-2.5" />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNavbar;
