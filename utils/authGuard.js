// utils/authGuard.js
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export function useAuthGuard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.replace("/login");
      } else {
        setUser(u);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  return { user, loading };
}
