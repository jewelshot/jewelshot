'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { generateImage, checkStatus } from '@/app/actions/generate'
import { toast } from 'sonner'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState<number>(0)
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [status, setStatus] = useState('')
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/')
      } else {
        setUser(user)
        loadCredits(user.id)
      }
    }
    getUser()
  }, [router])

  const loadCredits = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single()

    if (!error && data) {
      setCredits(data.credits)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
      setResult(null)
    }
  }

  const handleGenerate = async () => {
    if (!image) {
      toast.error('Lütfen bir resim seçin')
      return
    }

    if (credits <= 0) {
      toast.error('Krediniz bitti! Lütfen kredi satın alın.')
      return
    }

    setProcessing(true)
    setResult(null)
    setStatus('Resim hazırlanıyor...')

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single()

      if (!profile || profile.credits <= 0) {
        toast.error('Yetersiz kredi')
        setProcessing(false)
        return
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ credits: profile.credits - 1 })
        .eq('id', user.id)

      if (updateError) {
        toast.error('Kredi düşülemedi')
        setProcessing(false)
        return
      }

      setCredits(profile.credits - 1)
      toast.success(`Kredi kullanıldı. Kalan: ${profile.credits - 1}`)

      const reader = new FileReader()
      reader.readAsDataURL(image)
      
      reader.onloadend = async () => {
        const base64 = reader.result as string
        setStatus('AI ile işleniyor...')
        
        const response = await generateImage(base64)
        
        if (!response.success) {
          toast.error('Hata: ' + response.error)
          setProcessing(false)
          return
        }

        let attempts = 0
        const maxAttempts = 60
        
        const pollStatus = async () => {
          attempts++
          setStatus(`Görsel oluşturuluyor... (${attempts}/${maxAttempts})`)
          
          const statusResult = await checkStatus(response.statusUrl!, response.responseUrl!)
          
          if (statusResult.success && statusResult.status === 'COMPLETED' && statusResult.imageUrl) {
            setResult(statusResult.imageUrl)
            setStatus('Tamamlandı!')
            setProcessing(false)
            toast.success('Görsel başarıyla oluşturuldu! 🎉')
            
            await supabase.from('images').insert({
              user_id: user.id,
              original_url: base64.substring(0, 100),
              result_url: statusResult.imageUrl,
              prompt: 'jewelry catalog'
            })
            
          } else if (!statusResult.success) {
            toast.error('Görsel oluşturulamadı')
            setProcessing(false)
          } else if (attempts < maxAttempts) {
            setTimeout(pollStatus, 3000)
          } else {
            toast.error('Zaman aşımı')
            setProcessing(false)
          }
        }
        
        setTimeout(pollStatus, 3000)
      }
    } catch (error: any) {
      toast.error('Hata: ' + error.message)
      setProcessing(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-500 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header - Mobil Responsive */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white">💎 Jewelshot</h1>
            <p className="text-white/80 mt-1 sm:mt-2 text-sm sm:text-base">{user.email}</p>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="bg-white/20 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full flex-1 sm:flex-none">
              <span className="text-white font-bold text-base sm:text-lg">
                ⚡ {credits} Kredi
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-white text-purple-600 px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-100 transition font-semibold text-sm sm:text-base"
            >
              Çıkış
            </button>
          </div>
        </div>

        {credits <= 0 && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 sm:p-4 mb-6 sm:mb-8 rounded">
            <p className="font-bold text-yellow-800 text-sm sm:text-base">⚠️ Krediniz bitti!</p>
            <p className="text-yellow-700 text-xs sm:text-sm">Daha fazla görsel oluşturmak için kredi satın alın.</p>
          </div>
        )}
        
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            
            {/* Sol taraf - Upload - Mobil Responsive */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Takı Fotoğrafı</h2>
              <div className="border-4 border-dashed border-gray-300 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center hover:border-purple-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="file-input"
                  disabled={processing || credits <= 0}
                />
                <label htmlFor="file-input" className="cursor-pointer block">
                  {preview ? (
                    <img src={preview} alt="Preview" className="max-h-64 sm:max-h-96 mx-auto rounded-lg" />
                  ) : (
                    <div className="py-12 sm:py-20">
                      <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">📸</div>
                      <p className="text-gray-600 text-sm sm:text-base">Tıklayın ve fotoğraf seçin</p>
                    </div>
                  )}
                </label>
              </div>
              
              <button
                onClick={handleGenerate}
                disabled={!image || processing || credits <= 0}
                className="w-full mt-4 sm:mt-6 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-base sm:text-xl hover:shadow-lg transform hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? `⏳ ${status}` : credits <= 0 ? '❌ Krediniz Bitti' : '✨ Manken Üzerinde Göster'}
              </button>
            </div>

            {/* Sağ taraf - Result - Mobil Responsive */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Sonuç</h2>
              <div className="border-4 border-gray-300 rounded-xl sm:rounded-2xl p-6 sm:p-8 min-h-[300px] sm:min-h-[500px] flex items-center justify-center bg-gray-50">
                {processing ? (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 sm:h-20 w-16 sm:w-20 border-b-4 border-purple-600 mx-auto"></div>
                    <p className="mt-3 sm:mt-4 text-gray-600 text-sm sm:text-lg">{status}</p>
                  </div>
                ) : result ? (
                  <div className="text-center w-full">
                    <img src={result} alt="Result" className="max-h-full rounded-lg shadow-lg mb-3 sm:mb-4 mx-auto" />
                    <a 
                      href={result} 
                      download 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-green-500 text-white px-5 sm:px-6 py-2 rounded-lg hover:bg-green-600 transition text-sm sm:text-base"
                    >
                      📥 İndir
                    </a>
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">👗</div>
                    <p className="text-sm sm:text-base">Sonuç burada görünecek</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
