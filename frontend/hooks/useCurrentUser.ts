import { User } from "@/lib/types"
import axios from "axios";
import { useEffect, useState } from "react"

const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get<User>("http://localhost:8080/api/me", {
          withCredentials: true
        });
        setCurrentUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCurrentUser();
  }, []);

  return { currentUser };
};

export default useCurrentUser;
