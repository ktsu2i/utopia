import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Notification } from "@/lib/types";
import { User } from "lucide-react";

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification
}) => {
  return (
    <div className="flex gap-x-2 p-4 border-b border-gray-300">
      <User fill="#ff9933" className="text-utopia h-7 w-7" />
      
      <div className="space-y-2">
        <Avatar>
          <AvatarFallback>
            {notification.sender.accountName.substring(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <p>
          <span className="font-bold">{notification.sender.accountName}</span>{" " + notification.content}
        </p>
      </div>
    </div>
  );
};

export default NotificationItem;
