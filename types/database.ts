export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          credits: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          credits?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          credits?: number
          created_at?: string
          updated_at?: string
        }
      }
      images: {
        Row: {
          id: string
          user_id: string
          original_url: string
          result_url: string | null
          status: 'pending' | 'processing' | 'completed' | 'failed'
          fal_request_id: string | null
          cost_in_credits: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          original_url: string
          result_url?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          fal_request_id?: string | null
          cost_in_credits?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          original_url?: string
          result_url?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          fal_request_id?: string | null
          cost_in_credits?: number
          created_at?: string
        }
      }
      rate_limits: {
        Row: {
          id: string
          user_id: string
          action: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          created_at?: string
        }
      }
    }
    Functions: {
      deduct_credit: {
        Args: {
          user_uuid: string
          amount?: number
        }
        Returns: boolean
      }
      cleanup_old_rate_limits: {
        Args: Record<string, never>
        Returns: void
      }
    }
  }
}
