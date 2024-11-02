import { User } from "@/lib/types"
import axios from "axios"

export const getCurrentUser = async () => {
  try {
    const res = await axios.get<User>("http://localhost:8080/api/me", {
      withCredentials: true
    });

    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}