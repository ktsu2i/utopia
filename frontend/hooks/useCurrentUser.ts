import { User } from "@/lib/types"
import useCurrentUserStore from "@/stores/currentUserStore";
import axios from "axios";
import { useEffect } from "react"

export default function useCurrentUser() {
  const { currentUser, setCurrentUser } = useCurrentUserStore();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get<User>("http://localhost:8080/api/me", {
          withCredentials: true
        });
        setCurrentUser(res.data);
      } catch (error) {
        console.log(error);
        setCurrentUser(null);
      }
    };

    fetchCurrentUser();
  }, [setCurrentUser]);

  return { currentUser };
};
