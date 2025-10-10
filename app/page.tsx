'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [showAuth, setShowAuth] = useState(false)

  if (showAuth) {
    return <AuthForm />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-500">
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl font-bold text-white mb-6">
          💎 Takılarınızı AI Mankenlerle Sergileyin
        </h1>
        <p className="text-2xl text-white mb-12">
          Saniyeler içinde profesyonel katalog fotoğrafları
        </p>
        
        <button
          onClick={() => setShowAuth(true)}
          className="bg-white text-purple-600 px-12 py-4 rounded-full text-xl font-bold hover:scale-105 transition shadow-2xl"
        >
          🚀 Hemen Dene - Ücretsiz
        </button>
      </div>

      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Nasıl Çalışır?</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-6xl mb-4">📸</div>
              <h3 className="text-xl font-bold mb-2">1. Takı Fotoğrafı Yükle</h3>
              <p className="text-gray-600">Telefonunuzdan veya bilgisayarınızdan</p>
            </div>
            
            <div className="text-center">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-2">2. AI İşlesin</h3>
              <p className="text-gray-600">Yapay zeka manken üzerine giydiriyor</p>
            </div>
            
            <div className="text-center">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-xl font-bold mb-2">3. Hemen Kullan</h3>
              <p className="text-gray-600">Web sitenize, sosyal medyaya</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-purple-600 py-20 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">Hemen Başlayın</h2>
        <button
          onClick={() => setShowAuth(true)}
          className="bg-white text-purple-600 px-12 py-4 rounded-full text-xl font-bold hover:scale-105 transition"
        >
          Ücretsiz Dene
        </button>
      </div>
    </div>
  )
}

function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        alert('Kayıt başarılı! Giriş yapabilirsiniz.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/dashboard')
      }
    } catch (err) {
      const error = err as Error
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-2">💎 Jewelshot</h1>
        <p className="text-center text-gray-600 mb-8">AI Takı Vitrin Sistemi</p>
        
        <form onSubmit={handleAuth} className="space-y-4">
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Şifre (min 6 karakter)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            required
            minLength={6}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading ? 'Yükleniyor...' : isSignUp ? 'Kayıt Ol' : 'Giriş Yap'}
          </button>
        </form>

        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full mt-4 text-purple-600 hover:underline"
        >
          {isSignUp ? 'Zaten hesabım var' : 'Yeni hesap oluştur'}
        </button>
      </div>
    </div>
  )
}
