import { createClient } from '@/lib/supabase-server'
import { AuthStatus } from '@/components/features/auth/auth-status'

export async function Header() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">JewelShot</h1>
          </div>
          
          {user && <AuthStatus email={user.email || ''} />}
        </div>
      </div>
    </header>
  )
}
