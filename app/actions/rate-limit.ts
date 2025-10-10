'use server'

import { createClient } from '@/lib/supabase-server'

export async function checkRateLimit(action: string, limitPerHour: number = 20) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Son 1 saatteki işlemleri say
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from('rate_limits')
    .select('id')
    .eq('user_id', user.id)
    .eq('action', action)
    .gte('created_at', oneHourAgo)

  if (error) {
    console.error('Rate limit check error:', error)
    return { success: true } // Hata durumunda izin ver (kullanıcı mağdur olmasın)
  }

  const requestCount = data?.length || 0

  if (requestCount >= limitPerHour) {
    return { 
      success: false, 
      error: `Saatlik limit aşıldı. Lütfen ${Math.ceil((limitPerHour - requestCount) / limitPerHour * 60)} dakika sonra tekrar deneyin.`,
      remaining: 0
    }
  }

  return { 
    success: true, 
    remaining: limitPerHour - requestCount 
  }
}

export async function logRateLimit(action: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false }
  }

  const { error } = await supabase
    .from('rate_limits')
    .insert({
      user_id: user.id,
      action: action
    })

  if (error) {
    console.error('Rate limit log error:', error)
  }

  return { success: !error }
}
