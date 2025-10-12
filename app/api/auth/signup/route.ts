import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { SIGNUP_RATE_LIMIT, SIGNUP_RATE_WINDOW_MINUTES, MESSAGES } from '@/lib/constants'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email ve şifre gerekli' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Şifre en az 6 karakter olmalı' },
        { status: 400 }
      )
    }

    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      return NextResponse.json(
        { error: 'Şifre en az bir harf ve bir rakam içermeli' },
        { status: 400 }
      )
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    const rateLimitKey = `signup:${ip}`
    const { allowed } = await checkRateLimit(rateLimitKey, SIGNUP_RATE_LIMIT, SIGNUP_RATE_WINDOW_MINUTES)

    if (!allowed) {
      return NextResponse.json(
        { error: `Çok fazla kayıt denemesi. ${SIGNUP_RATE_WINDOW_MINUTES} dakika sonra tekrar deneyin.` },
        { status: 429 }
      )
    }

    const supabase = await createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${request.headers.get('origin')}/dashboard`,
      },
    })

    if (error) {
      const errorMessages: Record<string, string> = {
        'User already registered': 'Bu email zaten kayıtlı',
      }
      
      return NextResponse.json(
        { error: errorMessages[error.message] || 'Kayıt yapılamadı' },
        { status: 400 }
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
