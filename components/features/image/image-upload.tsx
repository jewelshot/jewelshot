'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'

export function ImageUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string>('')
  const [jobId, setJobId] = useState<string>('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Validation
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('Dosya boyutu 5MB\'dan kucuk olmali')
      return
    }

    if (!['image/jpeg', 'image/png'].includes(selectedFile.type)) {
      toast.error('Sadece JPG ve PNG dosyalari yuklenebilir')
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
        toast.error('Giris yapmaniz gerekiyor')
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

        setJobId(data.job_id)
        toast.success('Gorsel isleme alindi!')
        
        // Start polling
        pollStatus(data.job_id)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gorsel yuklenemedi'
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
          toast.success('Gorsel hazir!')
        } else if (data.status === 'failed') {
          clearInterval(interval)
          setLoading(false)
          toast.error('Gorsel olusturulamadi')
        }
      } catch {
        clearInterval(interval)
        setLoading(false)
        toast.error('Durum kontrolu basarisiz')
      }
    }, 3000) // Her 3 saniyede kontrol et
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Taki Fotografinizi Yukleyin
      </h2>

      <div className="space-y-4">
        <input
          type="file"
          accept="image/jpeg,image/png"
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
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {file && !loading && !result && (
          <Button onClick={handleUpload} className="w-full">
            AI ile Donustur
          </Button>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Profesyonel gorsel olusturuluyor...</p>
            <p className="text-xs text-gray-500 mt-1">Bu islem 30-60 saniye surebilir</p>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
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
                setJobId('')
              }}
              variant="secondary"
              className="w-full"
            >
              Yeni Gorsel Olustur
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
