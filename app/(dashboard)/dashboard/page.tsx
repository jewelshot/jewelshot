import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Hosgeldiniz, {profile?.email}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Kredi Bakiyesi</h2>
            <p className="text-4xl font-bold text-black">{profile?.credits || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Kalan kredi</p>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Hesap Bilgileri</h2>
            <p className="text-sm text-gray-600">E-posta: {profile?.email}</p>
            <p className="text-sm text-gray-600 mt-1">
              Uyelik: {new Date(profile?.created_at || '').toLocaleDateString('tr-TR')}
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
