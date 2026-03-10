"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthUserFirebase } from "@/store/authUser.store";

export function NoAuthRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthUserFirebase();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/dashboard"); // Já está logado, manda pro dashboard
    }
  }, [user, router]);

  if (user) return null;

  return <>{children}</>;
}
