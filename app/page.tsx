import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">JewelShot</h1>
            <div className="flex gap-4">
              <Link href="/login">
                <Button variant="ghost">Giris Yap</Button>
              </Link>
              <Link href="/signup">
                <Button>Ucretsiz Baslat</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center">
          <h2 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            Taki Fotograflarinizi{' '}
            <span className="text-black">AI ile Donusturun</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Profesyonel manken fotograflari, saniyeler icinde. E-ticaret icin mukemmel katalog gorselleri olusturun.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg">Ucretsiz Dene (1 Kredi)</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="secondary">Nasil Calisir?</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Neden JewelShot?
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Hizli</h4>
            <p className="text-gray-600">
              30-60 saniyede profesyonel manken fotograflari
            </p>
          </Card>
          <Card>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Uygun Fiyat</h4>
            <p className="text-gray-600">
              Geleneksel fotograf cekimlerinden 10x daha ucuz
            </p>
          </Card>
          <Card>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Kolay</h4>
            <p className="text-gray-600">
              Taki fotografinizi yukleyin, AI gerisini halleder
            </p>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-4">
            Simdi Baslayin
          </h3>
          <p className="text-gray-300 mb-8">
            Ilk goruntusu ucretsiz. Kredi karti gerekmiyor.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary">
              Ucretsiz Hesap Olustur
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>&copy; 2025 JewelShot. Tum haklari saklidir.</p>
        </div>
      </footer>
    </div>
  )
}
