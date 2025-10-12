'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES, POLL_INTERVAL_MS, MESSAGES } from '@/lib/constants'

export function ImageUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string>('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Validation
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error(MESSAGES.IMAGE.FILE_TOO_LARGE)
      return
    }

    if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
      toast.error(MESSAGES.IMAGE.INVALID_FILE_TYPE)
      return
    }

    setFile(selectedFile)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    setResult('')

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error(MESSAGES.AUTH.LOGIN_REQUIRED)
        return
      }

      // Convert to base64
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = async () => {
        const base64 = reader.result as string

        // Call API
        const response = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error)
        }

        toast.success(MESSAGES.IMAGE.UPLOAD_SUCCESS)
        
        // Start polling
        pollStatus(data.job_id)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : MESSAGES.IMAGE.GENERATION_FAILED
      toast.error(errorMessage)
      setLoading(false)
    }
  }

  const pollStatus = async (id: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/check-status/${id}`)
        const data = await response.json()

        if (data.status === 'completed') {
          clearInterval(interval)
          setResult(data.image_url)
          setLoading(false)
          toast.success(MESSAGES.IMAGE.GENERATION_COMPLETE)
        } else if (data.status === 'failed') {
          clearInterval(interval)
          setLoading(false)
          toast.error(MESSAGES.IMAGE.GENERATION_FAILED)
        }
      } catch {
        clearInterval(interval)
        setLoading(false)
        toast.error(MESSAGES.ERRORS.GENERIC)
      }
    }, POLL_INTERVAL_MS)
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Takı Fotoğrafınızı Yükleyin
      </h2>

      <div className="space-y-4">
        <input
          type="file"
          accept={ALLOWED_FILE_TYPES.join(',')}
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-600
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-medium
            file:bg-black file:text-white
            hover:file:bg-gray-800"
          disabled={loading}
        />

        {preview && (
          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {file && !loading && !result && (
          <Button onClick={handleUpload} className="w-full">
            AI ile Dönüştür
          </Button>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Profesyonel görsel oluşturuluyor...</p>
            <p className="text-xs text-gray-500 mt-1">Bu işlem 30-60 saniye sürebilir</p>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result}
                alt="Generated"
                className="w-full h-full object-contain"
              />
            </div>
            <Button
              onClick={() => {
                setFile(null)
                setPreview('')
                setResult('')
              }}
              variant="secondary"
              className="w-full"
            >
              Yeni Görsel Oluştur
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
