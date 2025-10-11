'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface AuthStatusProps {
  email: string
}

export function AuthStatus({ email }: AuthStatusProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        toast.error('Cikis yapilamadi')
        return
      }
      
      toast.success('Cikis yapildi')
      
      // Önce cookie'leri temizle, sonra redirect
      setTimeout(() => {
        window.location.href = '/login'
      }, 500)
    } catch (err) {
      toast.error('Bir hata olustu')
    }
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-600">{email}</span>
      <Button variant="ghost" size="sm" onClick={handleLogout}>
        Cikis Yap
      </Button>
    </div>
  )
}
