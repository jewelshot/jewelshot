// app/test/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function TestPage() {
  const [status, setStatus] = useState<'checking' | 'ok' | 'error'>('checking');
  const [msg, setMsg] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        // Basit bağlantı testi: auth session iste
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        setStatus('ok');
        setMsg(`Connected. session: ${data.session ? 'exists' : 'none'}`);
      } catch (e: any) {
        setStatus('error');
        setMsg(e?.message || 'Unknown error');
      }
    })();
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>Supabase Connection Test</h1>
      <p>Status: <b>{status}</b></p>
      {msg && <pre>{msg}</pre>}
    </main>
  );
}
