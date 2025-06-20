export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action_type: string
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      document_emails: {
        Row: {
          document_id: string | null
          id: string
          message: string | null
          recipient_email: string
          sender_id: string | null
          sent_at: string | null
          status: string | null
          subject: string
        }
        Insert: {
          document_id?: string | null
          id?: string
          message?: string | null
          recipient_email: string
          sender_id?: string | null
          sent_at?: string | null
          status?: string | null
          subject: string
        }
        Update: {
          document_id?: string | null
          id?: string
          message?: string | null
          recipient_email?: string
          sender_id?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_emails_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          archived: boolean | null
          category: string
          created_at: string | null
          file_type: string | null
          file_url: string
          id: string
          is_favorite: boolean | null
          name: string
          pet_id: string | null
          share_expiry: string | null
          share_id: string | null
          user_id: string
        }
        Insert: {
          archived?: boolean | null
          category: string
          created_at?: string | null
          file_type?: string | null
          file_url: string
          id?: string
          is_favorite?: boolean | null
          name: string
          pet_id?: string | null
          share_expiry?: string | null
          share_id?: string | null
          user_id: string
        }
        Update: {
          archived?: boolean | null
          category?: string
          created_at?: string | null
          file_type?: string | null
          file_url?: string
          id?: string
          is_favorite?: boolean | null
          name?: string
          pet_id?: string | null
          share_expiry?: string | null
          share_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      health_records: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          pet_id: string
          record_date: string
          user_id: string
          weight: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          pet_id: string
          record_date?: string
          user_id: string
          weight?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          pet_id?: string
          record_date?: string
          user_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "health_records_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_events: {
        Row: {
          cost: number | null
          created_at: string | null
          description: string | null
          event_date: string
          event_type: string
          id: string
          pet_id: string
          provider: string | null
          title: string
          user_id: string
        }
        Insert: {
          cost?: number | null
          created_at?: string | null
          description?: string | null
          event_date: string
          event_type: string
          id?: string
          pet_id: string
          provider?: string | null
          title: string
          user_id: string
        }
        Update: {
          cost?: number | null
          created_at?: string | null
          description?: string | null
          event_date?: string
          event_type?: string
          id?: string
          pet_id?: string
          provider?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_events_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          created_at: string | null
          dosage: string | null
          end_date: string | null
          frequency: string | null
          health_record_id: string | null
          id: string
          name: string
          notes: string | null
          pet_id: string
          start_date: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          dosage?: string | null
          end_date?: string | null
          frequency?: string | null
          health_record_id?: string | null
          id?: string
          name: string
          notes?: string | null
          pet_id: string
          start_date?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          dosage?: string | null
          end_date?: string | null
          frequency?: string | null
          health_record_id?: string | null
          id?: string
          name?: string
          notes?: string | null
          pet_id?: string
          start_date?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medications_health_record_id_fkey"
            columns: ["health_record_id"]
            isOneToOne: false
            referencedRelation: "health_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medications_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_medications: {
        Row: {
          created_at: string | null
          dosage: string | null
          frequency: string | null
          id: string
          name: string
          pet_id: string
          provider: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dosage?: string | null
          frequency?: string | null
          id?: string
          name: string
          pet_id: string
          provider?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dosage?: string | null
          frequency?: string | null
          id?: string
          name?: string
          pet_id?: string
          provider?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pet_medications_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_profiles: {
        Row: {
          created_at: string | null
          food_type: string | null
          has_insurance: boolean | null
          id: string
          insurance_provider: string | null
          pet_id: string
          treats: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          food_type?: string | null
          has_insurance?: boolean | null
          id?: string
          insurance_provider?: string | null
          pet_id: string
          treats?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          food_type?: string | null
          has_insurance?: boolean | null
          id?: string
          insurance_provider?: string | null
          pet_id?: string
          treats?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pet_profiles_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_supplements: {
        Row: {
          created_at: string | null
          dosage: string | null
          frequency: string | null
          id: string
          name: string
          pet_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dosage?: string | null
          frequency?: string | null
          id?: string
          name: string
          pet_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dosage?: string | null
          frequency?: string | null
          id?: string
          name?: string
          pet_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pet_supplements_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pets: {
        Row: {
          archived: boolean | null
          birth_or_adoption_date: string
          breed: string | null
          created_at: string | null
          gender: string
          id: string
          name: string
          pet_identifier: string | null
          photo_url: string | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          archived?: boolean | null
          birth_or_adoption_date: string
          breed?: string | null
          created_at?: string | null
          gender: string
          id?: string
          name: string
          pet_identifier?: string | null
          photo_url?: string | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          archived?: boolean | null
          birth_or_adoption_date?: string
          breed?: string | null
          created_at?: string | null
          gender?: string
          id?: string
          name?: string
          pet_identifier?: string | null
          photo_url?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      photos: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          pet_id: string
          url: string
          user_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          pet_id: string
          url: string
          user_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          pet_id?: string
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "photos_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_completion: {
        Row: {
          completion_percentage: number | null
          created_at: string | null
          has_document: boolean | null
          has_pet: boolean | null
          has_pet_photo: boolean | null
          id: string
          last_updated: string | null
        }
        Insert: {
          completion_percentage?: number | null
          created_at?: string | null
          has_document?: boolean | null
          has_pet?: boolean | null
          has_pet_photo?: boolean | null
          id: string
          last_updated?: string | null
        }
        Update: {
          completion_percentage?: number | null
          created_at?: string | null
          has_document?: boolean | null
          has_pet?: boolean | null
          has_pet_photo?: boolean | null
          id?: string
          last_updated?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          custom_categories: string[] | null
          full_name: string | null
          id: string
          phone: string | null
          referral_points: number | null
          registration_completed_at: string | null
          sms_opt_in: boolean | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          custom_categories?: string[] | null
          full_name?: string | null
          id: string
          phone?: string | null
          referral_points?: number | null
          registration_completed_at?: string | null
          sms_opt_in?: boolean | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          custom_categories?: string[] | null
          full_name?: string | null
          id?: string
          phone?: string | null
          referral_points?: number | null
          registration_completed_at?: string | null
          sms_opt_in?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      referral_codes: {
        Row: {
          code: string
          created_at: string | null
          id: string
          is_active: boolean | null
          unique_code: string | null
          used_count: number | null
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          unique_code?: string | null
          used_count?: number | null
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          unique_code?: string | null
          used_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string | null
          id: string
          referred_user_id: string
          referrer_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          referred_user_id: string
          referrer_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          referred_user_id?: string
          referrer_id?: string
        }
        Relationships: []
      }
      reminder_pets: {
        Row: {
          created_at: string | null
          id: string
          pet_id: string
          reminder_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          pet_id: string
          reminder_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          pet_id?: string
          reminder_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminder_pets_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminder_pets_reminder_id_fkey"
            columns: ["reminder_id"]
            isOneToOne: false
            referencedRelation: "reminders"
            referencedColumns: ["id"]
          },
        ]
      }
      reminders: {
        Row: {
          archived: boolean | null
          created_at: string | null
          custom_time: string | null
          date: string
          id: string
          notes: string | null
          notification_sent: boolean
          pet_id: string | null
          pet_name: string
          title: string
          user_id: string
        }
        Insert: {
          archived?: boolean | null
          created_at?: string | null
          custom_time?: string | null
          date: string
          id?: string
          notes?: string | null
          notification_sent?: boolean
          pet_id?: string | null
          pet_name: string
          title: string
          user_id: string
        }
        Update: {
          archived?: boolean | null
          created_at?: string | null
          custom_time?: string | null
          date?: string
          id?: string
          notes?: string | null
          notification_sent?: boolean
          pet_id?: string | null
          pet_name?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activities: {
        Row: {
          action: string
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string | null
          email_notifications: boolean | null
          id: string
          reminder_advance_notice: number | null
          reminder_time: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          reminder_advance_notice?: number | null
          reminder_time?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          reminder_advance_notice?: number | null
          reminder_time?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_registration_status: {
        Row: {
          created_at: string | null
          registration_completed_at: string | null
          registration_status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          registration_completed_at?: string | null
          registration_status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          registration_completed_at?: string | null
          registration_status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      vaccinations: {
        Row: {
          administrator: string | null
          batch_number: string | null
          created_at: string | null
          date_administered: string
          expiration_date: string | null
          id: string
          name: string
          notes: string | null
          pet_id: string
          user_id: string
        }
        Insert: {
          administrator?: string | null
          batch_number?: string | null
          created_at?: string | null
          date_administered: string
          expiration_date?: string | null
          id?: string
          name: string
          notes?: string | null
          pet_id: string
          user_id: string
        }
        Update: {
          administrator?: string | null
          batch_number?: string | null
          created_at?: string | null
          date_administered?: string
          expiration_date?: string | null
          id?: string
          name?: string
          notes?: string | null
          pet_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vaccinations_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      welcome_email_queue: {
        Row: {
          created_at: string | null
          email: string
          email_sent: boolean | null
          email_sent_at: string | null
          id: string
          metadata: Json | null
          registration_completed_at: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          email_sent?: boolean | null
          email_sent_at?: string | null
          id?: string
          metadata?: Json | null
          registration_completed_at: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          email_sent?: boolean | null
          email_sent_at?: string | null
          id?: string
          metadata?: Json | null
          registration_completed_at?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_unique_pet_id: {
        Args: { p_pet_type: string; p_gender: string; p_birth_date: string }
        Returns: string
      }
      get_admin_stats: {
        Args: { period_days?: number }
        Returns: Json
      }
      get_user_by_email: {
        Args: { p_email: string }
        Returns: {
          id: string
          email: string
        }[]
      }
      get_user_email: {
        Args: { user_id: string }
        Returns: string
      }
      has_completed_registration: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      has_valid_access: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_referral_code_available: {
        Args: { code_to_check: string }
        Returns: boolean
      }
      process_all_welcome_emails: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      send_welcome_email_direct: {
        Args: { user_id: string; recipient_email: string }
        Returns: Json
      }
      set_registration_completed: {
        Args: { user_id: string }
        Returns: undefined
      }
      test_welcome_email_function: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      trigger_welcome_emails: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
