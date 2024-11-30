"use client";

import { TailSpin } from "react-loader-spinner";

export default function Loading() {
  return (
    <div className="h-screen flex items-center justify-center">
      <TailSpin color="#FF9933" />
    </div>
  );
}
