'use client';

import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabaseBrowser.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace('/login');
      } else {
        setEmail(data.session.user.email ?? null);
        setReady(true);
      }
    });
  }, [router]);

  if (!ready) return <p style={{ padding: 24 }}>Yükleniyor…</p>;

  return (
    <main style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <p>Hoş geldin {email ?? 'kullanıcı'} 👋</p>
      <button
        onClick={async () => {
          await supabaseBrowser.auth.signOut();
          router.push('/login');
        }}
        style={{ marginTop: 16 }}
      >
        Çıkış yap
      </button>
    </main>
  );
}
