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

    // IP-based rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    const rateLimitKey = `login:${ip}`
    const { allowed, remaining } = await checkRateLimit(rateLimitKey, 5, 15)

    if (!allowed) {
      return NextResponse.json(
        { error: 'Cok fazla giris denemesi. 15 dakika sonra tekrar deneyin.' },
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
        'Invalid login credentials': 'Gecersiz email veya sifre',
        'Email not confirmed': 'Email adresinizi onaylayin',
      }
      
      return NextResponse.json(
        { error: errorMessages[error.message] || 'Giris yapilamadi' },
        { status: 401 }
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
