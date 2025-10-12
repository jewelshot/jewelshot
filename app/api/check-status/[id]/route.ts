import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Giris yapmaniz gerekiyor' }, { status: 401 })
    }

    // Get job from database - Types automatically inferred!
    const { data: job, error: jobError } = await supabase
      .from('images')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (jobError || !job) {
      return NextResponse.json({ error: 'Islem bulunamadi' }, { status: 404 })
    }

    // If already completed, return cached result
    if (job.status === 'completed' && job.result_url) {
      return NextResponse.json({
        status: 'completed',
        image_url: job.result_url,
      })
    }

    // Check external service status
    const statusResponse = await fetch(
      `https://queue.fal.run/fal-ai/nano-banana/requests/${job.fal_request_id}/status`,
      {
        headers: {
          'Authorization': `Key ${process.env.FAL_API_KEY}`,
        },
      }
    )

    if (!statusResponse.ok) {
      return NextResponse.json({ status: 'processing' })
    }

    const statusText = await statusResponse.text()
    const statusData = JSON.parse(statusText)

    if (statusData.status === 'COMPLETED') {
      // Get result
      const resultResponse = await fetch(
        `https://queue.fal.run/fal-ai/nano-banana/requests/${job.fal_request_id}`,
        {
          headers: {
            'Authorization': `Key ${process.env.FAL_API_KEY}`,
          },
        }
      )

      const resultText = await resultResponse.text()
      const resultData = JSON.parse(resultText)
      const externalImageUrl = resultData.images[0].url

      // Download and upload to our storage
      const imageResponse = await fetch(externalImageUrl)
      const imageBlob = await imageResponse.blob()
      
      const fileName = `${user.id}/${id}.jpg`
      const { data: uploadData } = await supabase.storage
        .from('generated-images')
        .upload(fileName, imageBlob, {
          contentType: 'image/jpeg',
          upsert: true,
        })

      if (uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from('generated-images')
          .getPublicUrl(fileName)

        // Update database - Types work now!
        await supabase
          .from('images')
          .update({
            status: 'completed',
            result_url: publicUrlData.publicUrl,
          })
          .eq('id', id)

        return NextResponse.json({
          status: 'completed',
          image_url: publicUrlData.publicUrl,
        })
      }
    } else if (statusData.status === 'FAILED') {
      await supabase
        .from('images')
        .update({ status: 'failed' })
        .eq('id', id)

      return NextResponse.json({ status: 'failed' })
    }

    return NextResponse.json({ status: 'processing' })

  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { error: 'Durum kontrol edilemedi' },
      { status: 500 }
    )
  }
}
