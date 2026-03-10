"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthUserFirebase } from "@/store/authUser.store";

export function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthUserFirebase();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.replace("/");
    }
  }, [user, router]);

  if (!user) return null;

  return <>{children}</>;
}
