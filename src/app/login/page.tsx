'use client';

import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  // Login olduktan sonra dashboard'a at
  useEffect(() => {
    const { data: sub } = supabaseBrowser.auth.onAuthStateChange((_e, session) => {
      if (session) router.push('/dashboard');
    });
    return () => sub.subscription.unsubscribe();
  }, [router]);

  return (
    <div style={{ maxWidth: 420, margin: '48px auto' }}>
      <h1 style={{ marginBottom: 16 }}>JewelShot — Giriş</h1>
      <Auth
        supabaseClient={supabaseBrowser}
        appearance={{ theme: ThemeSupa }}
        providers={['google']}             // İstersen şimdilik kaldırabilirsin
        onlyThirdPartyProviders={false}    // E-posta magic link’i açık kalsın
        redirectTo={typeof window !== 'undefined' ? window.location.origin + '/dashboard' : undefined}
        showLinks={true}
      />
    </div>
  );
}
