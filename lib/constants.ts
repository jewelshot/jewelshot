// File upload constraints
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'] as const

// AI Generation
export const DEFAULT_PROMPT = 'Professional jewelry model photoshoot, elegant hand wearing luxury jewelry, studio lighting, high quality, commercial photography'
export const POLL_INTERVAL_MS = 3000 // 3 seconds

// Rate Limiting
export const LOGIN_RATE_LIMIT = 5
export const LOGIN_RATE_WINDOW_MINUTES = 15
export const SIGNUP_RATE_LIMIT = 3
export const SIGNUP_RATE_WINDOW_MINUTES = 60

// Credits
export const INITIAL_CREDITS = 1
export const IMAGE_GENERATION_COST = 1

// UI Messages (Turkish)
export const MESSAGES = {
  AUTH: {
    LOGIN_REQUIRED: 'Giriş yapmanız gerekiyor',
    LOGIN_SUCCESS: 'Giriş başarılı!',
    SIGNUP_SUCCESS: 'Hesap oluşturuldu!',
    LOGOUT_SUCCESS: 'Çıkış yapıldı',
    INVALID_CREDENTIALS: 'Geçersiz email veya şifre',
    EMAIL_NOT_CONFIRMED: 'Email adresinizi onaylayın',
  },
  CREDITS: {
    INSUFFICIENT: 'Yetersiz kredi',
  },
  IMAGE: {
    UPLOAD_SUCCESS: 'Görsel işleme alındı!',
    GENERATION_COMPLETE: 'Görsel hazır!',
    GENERATION_FAILED: 'Görsel oluşturulamadı',
    FILE_TOO_LARGE: 'Dosya boyutu 5MB\'dan küçük olmalı',
    INVALID_FILE_TYPE: 'Sadece JPG ve PNG dosyaları yüklenebilir',
  },
  ERRORS: {
    GENERIC: 'Bir hata oluştu',
    RATE_LIMIT: 'Çok fazla deneme. Lütfen daha sonra tekrar deneyin.',
  },
} as const
