"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Demo() {
  const router = useRouter();

  const onSubmit = async () => {
    try {
      // eslint-disable-next-line
      const res = await axios.post("http://localhost:8080/api/logout", null, { withCredentials: true });
      router.push("/login");
      toast.success("See you later!");
    } catch {
      toast.error("Something went wrong.");
    }
  }

  return (
    <>
      <h1>Demo page</h1>
      <Button onClick={onSubmit}>Logout</Button>
    </>
  )
}