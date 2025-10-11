'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

interface AuthFormProps {
  mode: 'login' | 'signup'
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint = mode === 'signup' ? '/api/auth/signup' : '/api/auth/login'
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      toast.success(mode === 'signup' ? 'Hesap olusturuldu!' : 'Giris basarili!')
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bir hata olustu'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {mode === 'signup' ? 'Hesap Olustur' : 'Giris Yap'}
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          {mode === 'signup' ? 'JewelShot a hos geldiniz' : 'Hesabiniza giris yapin'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="E-posta"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <Input
          label="Sifre"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
        />

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Button type="submit" className="w-full" isLoading={loading}>
          {mode === 'signup' ? 'Hesap Olustur' : 'Giris Yap'}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          {mode === 'signup' ? 'Zaten hesabiniz var mi?' : 'Hesabiniz yok mu?'} <a href={mode === 'signup' ? '/login' : '/signup'} className="text-black font-medium hover:underline">{mode === 'signup' ? 'Giris Yap' : 'Hesap Olustur'}</a>
        </p>
      </div>
    </Card>
  )
}
