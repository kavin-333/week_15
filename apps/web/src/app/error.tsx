"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="h-20 w-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
        <AlertCircle className="h-10 w-10 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold mb-3">Something went wrong!</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        We encountered a network or server error while trying to process your request.
      </p>
      <Button
        onClick={() => reset()}
        className="bg-white text-black hover:bg-gray-200 rounded-xl px-8 h-12 font-medium transition-all"
      >
        Try again
      </Button>
    </div>
  );
}
