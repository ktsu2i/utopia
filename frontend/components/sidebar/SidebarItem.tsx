import { LucideIcon } from "lucide-react"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation";

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

  const onClick = () => {
    router.push(href);
  };

  return (
    <Button
      onClick={onClick}
      variant="ghost"
      className="flex justify-start gap-4 py-6 w-[200px]"
    >
      <Icon size={24} strokeWidth={active ? 2.5 : 2} />
      <span className={`text-lg ${active ? "font-semibold" : ""}`}>{label}</span>
    </Button>
  )
}

export default SidebarItem;
