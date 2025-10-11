export default function EnvTest() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Production Test</h1>
      <div className="bg-gray-100 p-4 rounded">
        <p className="mb-2"><strong>Status:</strong></p>
        <p className="text-lg font-semibold">
          {url ? '✅ ÇALIŞIYOR' : '❌ EKSİK'}
        </p>
      </div>
    </div>
  )
}
