'use server'

import { createClient } from '@/lib/supabase-server'

export async function getUserCredits() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('credits')
    .eq('id', user.id)
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, credits: data.credits }
}

export async function deductCredit() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Önce kredi kontrolü
  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('credits')
    .eq('id', user.id)
    .single()

  if (fetchError || !profile) {
    return { success: false, error: 'Could not fetch credits' }
  }

  if (profile.credits <= 0) {
    return { success: false, error: 'Insufficient credits' }
  }

  // Kredi düş
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ 
      credits: profile.credits - 1,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id)

  if (updateError) {
    return { success: false, error: updateError.message }
  }

  return { success: true, remainingCredits: profile.credits - 1 }
}

export async function saveImage(originalUrl: string, resultUrl: string, prompt: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('images')
    .insert({
      user_id: user.id,
      original_url: originalUrl,
      result_url: resultUrl,
      prompt: prompt
    })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}
