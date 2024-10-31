import { Bell, Home, Mail, Search } from "lucide-react";
import { usePathname } from "next/navigation"
import SidebarItem from "./SidebarItem";

const SidebarRoutes = () => {
  const pathname = usePathname();

  const routes = [
    {
      icon: Home,
      label: "Home",
      href: "/home",
      active: pathname === "/home",
    },
    {
      icon: Search,
      label: "Search",
      href: "/search",
      active: pathname === "/search",
    },
    {
      icon: Bell,
      label: "Notifications",
      href: "/notifications",
      active: pathname === "/notifications",
    },
    {
      icon: Mail,
      label: "Messages",
      href: "/messages",
      active: pathname === "/messages",
    },
  ];

  return (
    <div className="flex flex-col items-end gap-4">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
          active={route.active}
        />
      ))}
    </div>
  );
};

export default SidebarRoutes;