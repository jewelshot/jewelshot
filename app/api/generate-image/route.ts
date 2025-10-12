import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { DEFAULT_PROMPT, IMAGE_GENERATION_COST, MESSAGES } from '@/lib/constants'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: MESSAGES.AUTH.LOGIN_REQUIRED }, { status: 401 })
    }

    // Check credits
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single()

    if (!profile || !profile.credits || profile.credits < IMAGE_GENERATION_COST) {
      return NextResponse.json({ error: MESSAGES.CREDITS.INSUFFICIENT }, { status: 402 })
    }

    const { image } = await request.json()
    
    if (!image) {
      return NextResponse.json({ error: 'Görsel gerekli' }, { status: 400 })
    }

    // Call Nano Banana API
    const externalResponse = await fetch('https://queue.fal.run/fal-ai/nano-banana/edit', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.FAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: DEFAULT_PROMPT,
        image_urls: [image],
        num_images: 1,
        output_format: 'jpeg',
      }),
    })

    console.log('API Response Status:', externalResponse.status)
    const responseText = await externalResponse.text()
    console.log('API Response Body:', responseText)

    if (!externalResponse.ok) {
      console.error('API Error:', responseText)
      return NextResponse.json(
        { error: MESSAGES.IMAGE.GENERATION_FAILED },
        { status: 500 }
      )
    }

    const externalData = JSON.parse(responseText)

    // Save to database
    const jobId = crypto.randomUUID()
    
    await supabase.from('images').insert({
      id: jobId,
      user_id: user.id,
      original_url: 'pending',
      status: 'processing',
      fal_request_id: externalData.request_id,
    })

    // Deduct credit
    await supabase.rpc('deduct_credit', {
      user_uuid: user.id,
      amount: IMAGE_GENERATION_COST,
    })

    return NextResponse.json({
      success: true,
      job_id: jobId,
      status: 'processing',
    })

  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: MESSAGES.IMAGE.GENERATION_FAILED },
      { status: 500 }
    )
  }
}
