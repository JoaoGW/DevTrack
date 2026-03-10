"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthUserFirebase } from "@/store/authUser.store";

export function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthUserFirebase();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user === null) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  return <>{children}</>;
}
