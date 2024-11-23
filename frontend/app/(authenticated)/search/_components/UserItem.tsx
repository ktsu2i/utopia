import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@/lib/types";
import useAuthStore from "@/stores/authStore";
import { useRouter } from "next/navigation";

interface UserItemProps {
  user: User;
}

const UserItem: React.FC<UserItemProps> = ({
  user,
}) => {
  const { currentUser } = useAuthStore();
  const router = useRouter();

  const onClick = () => {
    if (user.id === currentUser?.id) {
      router.push("/profile"); 
    } else {
      router.push(`/profile/${user.id}`);
    }
  };

  return (
    <div className="w-full border-b border-gray-300 p-4">
      <div onClick={onClick} className="flex items-center gap-x-4 cursor-pointer">
        <Avatar>
          <AvatarFallback>
            {user.accountName.substring(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="text-lg font-bold">{user.accountName}</div>
          <div className="text-gray-500">{"@" + user.username}</div>
        </div>
      </div>
    </div>
  );
};

export default UserItem;
