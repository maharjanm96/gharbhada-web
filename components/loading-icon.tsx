"use client";

import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";

export function LoadingIcon() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative flex items-center justify-center">
        <Spinner className="size-60 text-primary" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/gharbhada.svg"
            alt="GharBhada"
            width={150}
            height={150}
            className="opacity-90"
            priority
          />
        </div>
      </div>
    </div>
  );
}
