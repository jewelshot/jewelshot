import { AuthForm } from '@/components/features/auth/auth-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <AuthForm mode="login" />
    </div>
  )
}
