import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Giris yapmaniz gerekiyor' }, { status: 401 })
    }

    // Check credits
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single()

    if (!profile || !profile.credits || profile.credits < 1) {
      return NextResponse.json({ error: 'Yetersiz kredi' }, { status: 402 })
    }

    const { image } = await request.json()
    
    if (!image) {
      return NextResponse.json({ error: 'Gorsel gerekli' }, { status: 400 })
    }

    // Call Nano Banana API
    const externalResponse = await fetch('https://queue.fal.run/fal-ai/nano-banana/edit', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.FAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Professional jewelry model photoshoot, elegant hand wearing luxury jewelry, studio lighting, high quality, commercial photography',
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
        { error: 'Gorsel olusturulamadi' },
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
      amount: 1,
    })

    return NextResponse.json({
      success: true,
      job_id: jobId,
      status: 'processing',
    })

  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: 'Gorsel olusturulamadi' },
      { status: 500 }
    )
  }
}
