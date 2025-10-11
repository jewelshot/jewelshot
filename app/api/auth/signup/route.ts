import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email ve sifre gerekli' },
        { status: 400 }
      )
    }

    // Password validation (backend)
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Sifre en az 6 karakter olmali' },
        { status: 400 }
      )
    }

    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      return NextResponse.json(
        { error: 'Sifre en az bir harf ve bir rakam icermeli' },
        { status: 400 }
      )
    }

    // IP-based rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    const rateLimitKey = `signup:${ip}`
    const { allowed } = await checkRateLimit(rateLimitKey, 3, 60)

    if (!allowed) {
      return NextResponse.json(
        { error: 'Cok fazla kayit denemesi. 1 saat sonra tekrar deneyin.' },
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
        'User already registered': 'Bu email zaten kayitli',
      }
      
      return NextResponse.json(
        { error: errorMessages[error.message] || 'Kayit yapilamadi' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Bir hata olustu' },
      { status: 500 }
    )
  }
}
