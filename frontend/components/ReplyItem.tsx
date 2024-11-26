"use client";

import { Reaction, Reply } from "@/lib/types";
import { ArrowLeft, Ellipsis, MessageCircle, SmilePlus } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button, buttonVariants } from "./ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import useAuthStore from "@/stores/authStore";
import { useEffect, useState } from "react";
import { useEmojis } from "@/hooks/useEmojis";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { parseEmoji } from "@/lib/utils";

interface ReplyItemProps {
	reply: Reply;
	isSelected: boolean;
}

interface GroupedReaction extends Reaction {
  count: number;
  userIds: string[];
}

const ReplyItem: React.FC<ReplyItemProps> = ({
	reply,
	isSelected,
}) => {
	const { currentUser } = useAuthStore();
	const { emojis } = useEmojis();
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
  const [isEmojisOpen, setIsEmojisOpen] = useState(false);
	const [childReplyCount, setChildReplyCount] = useState(0);

	const repliedDate = formatDistanceToNowStrict(parseISO(reply.updatedAt));

	const groupedReactions = Object.values(
    reply.reactions.reduce((acc: { [key: number]: GroupedReaction }, reaction: Reaction) => {
      const emojiId = reaction.emojiId;

      if (!acc[emojiId]) {
        acc[emojiId] = { ...reaction, count: 0, userIds: [] };
      }
      acc[emojiId].count += 1;
      acc[emojiId].userIds.push(reaction.userId);

      return acc;
    }, {})
  );

	const addReaction = async (emojiId: number) => {
    try {
      await axios.post<Reaction>("http://localhost:8080/api/reactions", {
        replyId: reply.id,
        emojiId: emojiId,
				receiverId: reply.userId,
      }, { withCredentials: true });
      
      setIsEmojisOpen(false);
    } catch {
      setIsEmojisOpen(false);
    }
  };

  const removeReaction = async (reactionId: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/reactions/${reactionId}`, { withCredentials: true });
    } catch {
      // no error handling
    }
  };

  const handleReaction = (emojiId: number, userIds: string[]) => {
    if (userIds.includes(currentUser?.id || "")) {
      const reaction = reply.reactions.find(r => r.emojiId === emojiId && r.userId === currentUser?.id);
      if (reaction) removeReaction(reaction.id);
    } else {
      addReaction(emojiId);
    }
  };

	const handleDeleteReply = async () => {
    setIsOpen(false);
    try {
      await axios.delete(`http://localhost:8080/api/replies/${reply.id}`, { withCredentials: true });
      if (isSelected) {
        router.push("/home");
      }
      toast.success("Deleted reply");
    } catch {
      toast.error("Something went wrong");
    }
  };

	const onClick = () => {
		router.push(`/home/posts/${reply.postId}/${reply.id}`);
	};

	// count child replies
	useEffect(() => {
		const fetchCount = async () => {
			try {
				const res = await axios.get<number>(`http://localhost:8080/api/replies/${reply.id}/count`);
				setChildReplyCount(res.data);
			} catch {
				// error handling
			}
		};

		fetchCount();

		const socket = new WebSocket("ws://localhost:8080/api/ws");

    socket.onmessage = (event) => {
      if (event.data === "create_reply" || event.data === "delete_reply") {
        fetchCount();
      }
    };

    return () => {
      socket.close();
    }
	}, [reply]);

	return (
		<div className="border-b border-gray-300 last:border-b-0 p-4">
			<div className="flex flex-col gap-y-2">
				{/* Header */}
				{isSelected && (
          <div className="flex items-center gap-5 py-2 pr-2 mb-2">
            <div onClick={() => router.back()} className="p-1 rounded-full hover:bg-utopia_light hover:text-utopia">
              <ArrowLeft />
            </div>
            <span className="font-bold text-xl">Post</span>
          </div>
        )}

				<div className="flex gap-x-2">
					<div className="h-full">
						<Avatar
              className="cursor-pointer"
							onClick={() =>
              	reply.userId === currentUser?.id ? 
                	router.push("/profile") : 
                	router.push(`/profile/${reply.userId}`)
            	}
						>
							<AvatarFallback>
								{reply.user.accountName.substring(0, 1).toUpperCase()}
							</AvatarFallback>
						</Avatar>
					</div>
					<div className="w-full">
						<div className="flex justify-between">
							<div 
                className="flex flex-col cursor-pointer pb-2"
                onClick={() =>
                  reply.userId === currentUser?.id ? 
                    router.push("/profile") : 
                    router.push(`/profile/${reply.userId}`)
                }
              >
								<span className="font-semibold">{reply.user.accountName}</span>
								<span className="text-sm text-gray-500">{"@" + reply.user.username} &middot; {repliedDate}</span>
							</div>
							<Popover open={isOpen} onOpenChange={setIsOpen}>
								<PopoverTrigger asChild>
									<Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:text-utopia hover:bg-utopia_light">
										<Ellipsis className="h-4 w-4" />
									</Button>
								</PopoverTrigger>
								<PopoverContent className="flex flex-col p-2 w-24">
									{currentUser?.id === reply.userId ? (
										<>
											<Button variant="ghost" className="justify-start">Edit</Button>
											<AlertDialog>
												<AlertDialogTrigger asChild>
													<Button
														variant="ghost"
														className="justify-start text-red-600 hover:text-red-600"
													>
														Delete
													</Button>
												</AlertDialogTrigger>
												<AlertDialogContent>
													<AlertDialogHeader>
														<AlertDialogTitle>Are you sure?</AlertDialogTitle>
														<AlertDialogDescription>
															This will permanently delete this reply. 
														</AlertDialogDescription>
													</AlertDialogHeader>
													<AlertDialogFooter>
														<AlertDialogCancel>Cancel</AlertDialogCancel>
														<AlertDialogAction
															onClick={handleDeleteReply} 
															className={buttonVariants({ variant: "destructive" })}
														>
															Delete
														</AlertDialogAction>
													</AlertDialogFooter>
												</AlertDialogContent>
											</AlertDialog>
										</>
									) : (
										<>
											<Button variant="ghost" className="justify-start">Follow</Button>
											<Button variant="ghost" className="justify-start">Mute</Button>
											<Button variant="ghost" className="justify-start text-red-600 hover:text-red-600">Block</Button>
										</>
									)}
								</PopoverContent>
							</Popover>
						</div>
						<div
							onClick={onClick}
							className={`whitespace-pre-wrap ${isSelected ? "text-lg p-2" : "cursor-pointer"}`}
						>
							{reply.content}
						</div>
					</div>
				</div>

					{/* Footer */}
				<div className="w-full flex items-center gap-2 justify-between">
					<div className="flex items-center gap-2">
						{Object.values(groupedReactions).map((groupedReaction) => (
							<Button
								key={groupedReaction.emojiId}
								variant="outline"
								size="sm"
								className={`text-sm px-2 py-1 ${groupedReaction.userIds.includes(currentUser?.id || "") ? "bg-utopia_light border-utopia" : ""}`}
								onClick={() => handleReaction(groupedReaction.emojiId, groupedReaction.userIds)}
							>
								{parseEmoji(groupedReaction.emoji.unicode)} {groupedReaction.count}
							</Button>
						))}
						<Popover open={isEmojisOpen} onOpenChange={setIsEmojisOpen}>
							<PopoverTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="text-gray-500 rounded-full w-8 h-8 p-0 hover:text-utopia hover:bg-utopia_light"
								>
									<SmilePlus className="h-5 w-5" />
									<span className="sr-only">Add reaction</span>
								</Button>
							</PopoverTrigger>
							<PopoverContent>
								<div className="grid grid-cols-4 gap-2">
									{emojis.map((emoji) => (
										<Button
											key={emoji.name}
											variant="ghost"
											className="text-2xl p-2"
											onClick={() => addReaction(emoji.id)}
										>
											{String.fromCodePoint(parseInt(emoji.unicode, 16))}
										</Button>
									))}
								</div>
							</PopoverContent>
						</Popover>
					</div>
					<div onClick={onClick} className="flex items-center gap-x-1 text-gray-500 px-2 py-1 hover:text-utopia hover:bg-utopia_light rounded-2xl cursor-pointer">
						<MessageCircle className="h-5 w-5" />
						<span>{childReplyCount}</span>
					</div>
				</div>
			</div>
		</div>	
	);
};

export default ReplyItem;
