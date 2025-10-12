import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { LOGIN_RATE_LIMIT, LOGIN_RATE_WINDOW_MINUTES, MESSAGES } from '@/lib/constants'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email ve şifre gerekli' },
        { status: 400 }
      )
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    const rateLimitKey = `login:${ip}`
    const { allowed } = await checkRateLimit(rateLimitKey, LOGIN_RATE_LIMIT, LOGIN_RATE_WINDOW_MINUTES)

    if (!allowed) {
      return NextResponse.json(
        { error: `Çok fazla giriş denemesi. ${LOGIN_RATE_WINDOW_MINUTES} dakika sonra tekrar deneyin.` },
        { status: 429 }
      )
    }

    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      const errorMessages: Record<string, string> = {
        'Invalid login credentials': MESSAGES.AUTH.INVALID_CREDENTIALS,
        'Email not confirmed': MESSAGES.AUTH.EMAIL_NOT_CONFIRMED,
      }
      
      return NextResponse.json(
        { error: errorMessages[error.message] || 'Giriş yapılamadı' },
        { status: 401 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: MESSAGES.ERRORS.GENERIC },
      { status: 500 }
    )
  }
}
