"use client";
import { useEffect } from "react";

import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/services/firebase";
import { useAuthUserFirebase } from "@/store/authUser.store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthUserFirebase();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return <>{children}</>;
}
