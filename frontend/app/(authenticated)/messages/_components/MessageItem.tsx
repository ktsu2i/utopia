"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Message } from "@/lib/types";
import useAuthStore from "@/stores/authStore";

interface MessageProps {
  message: Message;
}

const MessageItem: React.FC<MessageProps> = ({
  message,
}) => {
  const { currentUser } = useAuthStore();
  const isMe = currentUser?.id === message.senderId;

  return (
    <div className={`flex items-start gap-2 p-2 ${
      isMe ? "justify-end" : "justify-start"
    }`}>
      {!isMe && (
        <Avatar>
          <AvatarFallback>
            {message.sender?.accountName.substring(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`p-2 rounded-lg whitespace-pre-wrap ${
        isMe ? "bg-blue-500 text-white self-end" : "bg-gray-200 text-black self-start"
      }`}>
        {message.content}
      </div>

      {isMe && (
        <Avatar>
          <AvatarFallback>
            {message.sender?.accountName.substring(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default MessageItem;
