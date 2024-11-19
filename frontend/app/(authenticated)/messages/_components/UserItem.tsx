import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@/lib/types";

interface UserItemProps {
  user: User;
}

const UserItem: React.FC<UserItemProps> = ({
  user,
}) => {
  return (
    <div className="w-full bg-slate-300 p-2">
      <div className="flex gap-x-2">
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
