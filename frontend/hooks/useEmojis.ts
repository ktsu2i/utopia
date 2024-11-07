import { Emoji } from "@/lib/types";
import axios from "axios";
import { useEffect, useState } from "react";

export function useEmojis() {
  const [emojis, setEmojis] = useState<Emoji[]>([]);

  useEffect(() => {
    const fetchEmojis = async () => {
      try {
        const res = await axios.get<Emoji[]>("http://localhost:8080/api/emojis", { withCredentials: true });
        setEmojis(res.data);
      } catch {
        console.log("error");
      }
    };

    fetchEmojis();
  }, []);

  return { emojis };
}
