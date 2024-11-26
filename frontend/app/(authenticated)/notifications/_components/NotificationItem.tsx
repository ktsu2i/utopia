"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Notification } from "@/lib/types";
import { Mail, Send, User } from "lucide-react";
import { useRouter } from "next/navigation";

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification
}) => {
  const router = useRouter();

  const onClick = () => {
    if (notification.type === "follow") {
      router.push(`/profile/${notification.senderId}`);
    }

    if (notification.type === "message") {
      router.push(`/messages/${notification.senderId}`);
    }
  };

  return (
    <div onClick={onClick} className="flex gap-x-2 p-4 border-b border-gray-300 cursor-pointer hover:bg-gray-50">
      {notification.type === "follow" && <User className="text-utopia h-7 w-7" strokeWidth={2} />}
      {notification.type === "message" && <Mail className="text-green-500 h-6 w-6" strokeWidth={2} />}
      {notification.type === "reply" && <Send className="text-blue-500 h-6 w-6" strokeWidth={2} />}

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
