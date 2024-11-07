"use client";

import { useEmojis } from "@/hooks/useEmojis";
import useAuthStore from "@/stores/authStore";

export default function Settings() {
  const { isAuthenticated } = useAuthStore();

  const { emojis } = useEmojis();

  return (
    <>
      {isAuthenticated && (
        <div>Messages</div>
      )}
      <div>
        {emojis.map((emoji) => (<div key={emoji.id}>{emoji.unicode}</div>))}
      </div>
    </>
  );
}
