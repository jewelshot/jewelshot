"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function AuthStatus() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // mevcut oturumu al
    supabaseBrowser.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user?.email ?? null);
    });

    // değişiklikleri dinle
    const { data: sub } = supabaseBrowser.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!email) {
    return <Link href="/login">Giriş</Link>;
  }

  return (
    <span>
      {email} &nbsp;|&nbsp;
      <button
        onClick={() => supabaseBrowser.auth.signOut()}
        style={{ background: "transparent", border: "none", color: "#0070f3", cursor: "pointer" }}
      >
        Çıkış
      </button>
    </span>
  );
}
