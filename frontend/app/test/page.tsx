"use client";

import useTest from "@/hooks/useTest";

export default function Test() {
  const { data } = useTest();
  console.log(data);

  return <div>{data?.message}</div>
}