import { LucideIcon } from "lucide-react"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import useNotificationStore from "@/stores/notificationStore";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  active: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  href,
  active,
}) => {
  const router = useRouter();
  const hasNewNotification = useNotificationStore((state) => state.hasNewNotification);

  const onClick = () => {
    router.push(href);
  };

  return (
    <>
      {label === "Logo" ? (
        <Link
          href={href}
          className="flex justify-start gap-4 my-4 lg:w-[250px] lg:pl-2"
        >
          <Image src="/images/logo.png" height={120} width={120} alt="Utopia" className="hidden lg:block" />
          <Image src="/images/logo-square.png" height={45} width={45} alt="Utopia" className="lg:hidden" />
        </Link>
      ) : (
        <Button
          onClick={onClick}
          variant="ghost"
          className="flex justify-start gap-4 py-6 lg:w-[250px]"
        >
          <div className="relative">
            <Icon size={24} strokeWidth={active ? 2.5 : 2} />
            {label === "Notifications" && hasNewNotification && (
              <span className="absolute top-0 right-0 bg-utopia rounded-full w-2.5 h-2.5" />
            )}
          </div>
          <span className={`text-lg hidden lg:block ${active ? "font-semibold" : ""}`}>{label}</span>
        </Button>
      )}
    </>
  )
}

export default SidebarItem;
