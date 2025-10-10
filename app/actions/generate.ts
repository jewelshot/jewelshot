'use server'

export async function generateImage(imageBase64: string) {
  try {
    const apiKey = process.env.FAL_API_KEY
    
    if (!apiKey) {
      throw new Error('FAL API key not found')
    }

    // Submit request
    const submitResponse = await fetch('https://queue.fal.run/fal-ai/nano-banana/edit', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: "A professional fashion model wearing this exact jewelry piece. Preserve all original design details: metal color and type, all gemstones and their settings, patterns, engravings, texture, chain style, clasp design, and every decorative element. The jewelry must look identical to the input image. Clean white background, luxury jewelry catalog photography, professional studio lighting, photorealistic, high-end commercial quality. Model posed elegantly to showcase the jewelry piece naturally.",
        image_urls: [imageBase64],
        num_images: 1,
        output_format: "jpeg",
        aspect_ratio: "1:1"
      }),
    })

    const submitData = await submitResponse.json()
    
    if (!submitData.request_id) {
      throw new Error('Failed to submit request')
    }

    return {
      success: true,
      requestId: submitData.request_id,
      statusUrl: submitData.status_url,
      responseUrl: submitData.response_url
    }
  } catch (error) {
    console.error('Generate image error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function checkStatus(statusUrl: string, responseUrl: string) {
  try {
    const apiKey = process.env.FAL_API_KEY
    
    const statusResponse = await fetch(statusUrl, {
      headers: {
        'Authorization': `Key ${apiKey}`,
      },
    })
    
    const statusData = await statusResponse.json()
    
    if (statusData.status === 'COMPLETED') {
      const resultResponse = await fetch(responseUrl, {
        headers: {
          'Authorization': `Key ${apiKey}`,
        },
      })
      
      const resultData = await resultResponse.json()
      
      if (resultData.images && resultData.images[0]) {
        return {
          success: true,
          status: 'COMPLETED',
          imageUrl: resultData.images[0].url
        }
      }
    }
    
    return {
      success: true,
      status: statusData.status
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
