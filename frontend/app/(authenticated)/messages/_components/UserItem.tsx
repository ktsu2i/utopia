import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@/lib/types";
import { useRouter } from "next/navigation";

interface UserItemProps {
  user: User;
}

const UserItem: React.FC<UserItemProps> = ({
  user,
}) => {
  const router = useRouter();

  const onClick = () => {
    router.push(`/messages/${user.id}`);
  };

  return (
    <div className="w-full border-b border-gray-300 p-4">
      <div onClick={onClick} className="flex gap-x-2 cursor-pointer">
        <Avatar>
          <AvatarFallback>
            {user.accountName.substring(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>{user.accountName}</div>
      </div>
    </div>
  );
};

export default UserItem;
