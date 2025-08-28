// pages/index.js
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      router.replace(u ? "/dashboard" : "/login");
    });
    return () => unsub();
  }, [router]);
  return null;
}
