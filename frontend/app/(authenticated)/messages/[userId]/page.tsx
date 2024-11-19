"use client";

import { useParams } from "next/navigation";

export default function ChatPage() {
  const { userId } = useParams();
  
  return (
    <div>{userId}</div>
  );
}