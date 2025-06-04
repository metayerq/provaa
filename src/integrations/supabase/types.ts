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
      admin_settings: {
        Row: {
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: string
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: string
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: string
        }
        Relationships: []
      }
      banners: {
        Row: {
          created_at: string
          created_by: string | null
          display_order: number
          end_date: string | null
          id: string
          image_url: string
          is_active: boolean
          link_url: string | null
          start_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          display_order?: number
          end_date?: string | null
          id?: string
          image_url: string
          is_active?: boolean
          link_url?: string | null
          start_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          display_order?: number
          end_date?: string | null
          id?: string
          image_url?: string
          is_active?: boolean
          link_url?: string | null
          start_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          booking_reference: string
          cancelled_at: string | null
          created_at: string
          dietary_restrictions: string | null
          event_id: string
          guest_email: string | null
          guest_name: string | null
          guest_phone: string | null
          id: string
          number_of_tickets: number
          payment_method: string | null
          payment_method_used: string | null
          payment_status: string
          price_per_ticket: number
          special_requests: string | null
          spots_decremented: boolean
          status: string
          stripe_payment_intent_id: string | null
          stripe_refund_id: string | null
          stripe_session_id: string | null
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          booking_reference?: string
          cancelled_at?: string | null
          created_at?: string
          dietary_restrictions?: string | null
          event_id: string
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          id?: string
          number_of_tickets: number
          payment_method?: string | null
          payment_method_used?: string | null
          payment_status?: string
          price_per_ticket: number
          special_requests?: string | null
          spots_decremented?: boolean
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_refund_id?: string | null
          stripe_session_id?: string | null
          total_amount: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          booking_reference?: string
          cancelled_at?: string | null
          created_at?: string
          dietary_restrictions?: string | null
          event_id?: string
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          id?: string
          number_of_tickets?: number
          payment_method?: string | null
          payment_method_used?: string | null
          payment_status?: string
          price_per_ticket?: number
          special_requests?: string | null
          spots_decremented?: boolean
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_refund_id?: string | null
          stripe_session_id?: string | null
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_categories: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          emoji: string | null
          id: string
          is_approved: boolean | null
          name: string
          updated_at: string
          usage_count: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          emoji?: string | null
          id?: string
          is_approved?: boolean | null
          name: string
          updated_at?: string
          usage_count?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          emoji?: string | null
          id?: string
          is_approved?: boolean | null
          name?: string
          updated_at?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          booking_id: string | null
          created_at: string
          event_id: string | null
          host_id: string | null
          id: string
          recipient_email: string
          sent_at: string
          status: string
          subject: string
          template_id: string
          user_id: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          event_id?: string | null
          host_id?: string | null
          id?: string
          recipient_email: string
          sent_at?: string
          status?: string
          subject: string
          template_id: string
          user_id?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          event_id?: string | null
          host_id?: string | null
          id?: string
          recipient_email?: string
          sent_at?: string
          status?: string
          subject?: string
          template_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_logs_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          id: string
          name: string
          status: string
          subject: string
          type: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          status?: string
          subject: string
          type: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          status?: string
          subject?: string
          type?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      event_deletions: {
        Row: {
          attendee_count: number
          created_at: string
          custom_message: string | null
          deleted_at: string
          deletion_reason: string | null
          event_id: string
          event_title: string
          host_id: string
          id: string
          total_refund_amount: number
        }
        Insert: {
          attendee_count?: number
          created_at?: string
          custom_message?: string | null
          deleted_at?: string
          deletion_reason?: string | null
          event_id: string
          event_title: string
          host_id: string
          id?: string
          total_refund_amount?: number
        }
        Update: {
          attendee_count?: number
          created_at?: string
          custom_message?: string | null
          deleted_at?: string
          deletion_reason?: string | null
          event_id?: string
          event_title?: string
          host_id?: string
          id?: string
          total_refund_amount?: number
        }
        Relationships: []
      }
      events: {
        Row: {
          accessibility_info: string | null
          ambiance_description: string | null
          cancellation_policy: string | null
          capacity: number
          category: string | null
          created_at: string
          date: string | null
          description: string | null
          dietary_options: string[] | null
          dress_code: string | null
          duration: string | null
          food_pairings: string | null
          host_id: string | null
          id: string
          image: string | null
          location: Json
          meeting_point_details: string | null
          meta_description: string | null
          meta_title: string | null
          og_image_url: string | null
          price: number
          products: Json[] | null
          spots_left: number
          status: string | null
          time: string | null
          title: string
          updated_at: string
        }
        Insert: {
          accessibility_info?: string | null
          ambiance_description?: string | null
          cancellation_policy?: string | null
          capacity: number
          category?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          dietary_options?: string[] | null
          dress_code?: string | null
          duration?: string | null
          food_pairings?: string | null
          host_id?: string | null
          id?: string
          image?: string | null
          location: Json
          meeting_point_details?: string | null
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          price: number
          products?: Json[] | null
          spots_left: number
          status?: string | null
          time?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          accessibility_info?: string | null
          ambiance_description?: string | null
          cancellation_policy?: string | null
          capacity?: number
          category?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          dietary_options?: string[] | null
          dress_code?: string | null
          duration?: string | null
          food_pairings?: string | null
          host_id?: string | null
          id?: string
          image?: string | null
          location?: Json
          meeting_point_details?: string | null
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          price?: number
          products?: Json[] | null
          spots_left?: number
          status?: string | null
          time?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      host_follows: {
        Row: {
          created_at: string | null
          host_id: string | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          host_id?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          host_id?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      notification_settings: {
        Row: {
          created_at: string | null
          email_frequency: string | null
          host_notifications: boolean | null
          id: string
          push_notifications: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email_frequency?: string | null
          host_notifications?: boolean | null
          id?: string
          push_notifications?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email_frequency?: string | null
          host_notifications?: boolean | null
          id?: string
          push_notifications?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      payouts: {
        Row: {
          commission_amount: number
          created_at: string
          gross_amount: number
          host_id: string
          id: string
          net_amount: number
          paid_at: string | null
          payment_reference: string | null
          period_end: string
          period_start: string
          status: string
          updated_at: string
        }
        Insert: {
          commission_amount?: number
          created_at?: string
          gross_amount?: number
          host_id: string
          id?: string
          net_amount?: number
          paid_at?: string | null
          payment_reference?: string | null
          period_end: string
          period_start: string
          status?: string
          updated_at?: string
        }
        Update: {
          commission_amount?: number
          created_at?: string
          gross_amount?: number
          host_id?: string
          id?: string
          net_amount?: number
          paid_at?: string | null
          payment_reference?: string | null
          period_end?: string
          period_start?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payouts_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_holder_name: string | null
          avatar_url: string | null
          average_frequency_days: number | null
          bank_name: string | null
          bio: string | null
          company_name: string | null
          created_at: string | null
          credentials: string | null
          dietary_restrictions: string | null
          email_notifications: Json | null
          events_per_year: number | null
          favorite_categories: string[] | null
          follower_count: number | null
          full_name: string | null
          host_story: string | null
          iban: string | null
          id: string
          languages_spoken: string[] | null
          last_event_date: string | null
          location: string | null
          meta_description: string | null
          meta_title: string | null
          nif: string | null
          og_image_url: string | null
          payout_details_completed: boolean | null
          payout_details_updated_at: string | null
          profile_photo_url: string | null
          rating: number | null
          review_count: number | null
          role: string | null
          suspended: boolean | null
          swift_code: string | null
          updated_at: string | null
          user_type: string | null
          vat_number: string | null
          verified: boolean | null
        }
        Insert: {
          account_holder_name?: string | null
          avatar_url?: string | null
          average_frequency_days?: number | null
          bank_name?: string | null
          bio?: string | null
          company_name?: string | null
          created_at?: string | null
          credentials?: string | null
          dietary_restrictions?: string | null
          email_notifications?: Json | null
          events_per_year?: number | null
          favorite_categories?: string[] | null
          follower_count?: number | null
          full_name?: string | null
          host_story?: string | null
          iban?: string | null
          id: string
          languages_spoken?: string[] | null
          last_event_date?: string | null
          location?: string | null
          meta_description?: string | null
          meta_title?: string | null
          nif?: string | null
          og_image_url?: string | null
          payout_details_completed?: boolean | null
          payout_details_updated_at?: string | null
          profile_photo_url?: string | null
          rating?: number | null
          review_count?: number | null
          role?: string | null
          suspended?: boolean | null
          swift_code?: string | null
          updated_at?: string | null
          user_type?: string | null
          vat_number?: string | null
          verified?: boolean | null
        }
        Update: {
          account_holder_name?: string | null
          avatar_url?: string | null
          average_frequency_days?: number | null
          bank_name?: string | null
          bio?: string | null
          company_name?: string | null
          created_at?: string | null
          credentials?: string | null
          dietary_restrictions?: string | null
          email_notifications?: Json | null
          events_per_year?: number | null
          favorite_categories?: string[] | null
          follower_count?: number | null
          full_name?: string | null
          host_story?: string | null
          iban?: string | null
          id?: string
          languages_spoken?: string[] | null
          last_event_date?: string | null
          location?: string | null
          meta_description?: string | null
          meta_title?: string | null
          nif?: string | null
          og_image_url?: string | null
          payout_details_completed?: boolean | null
          payout_details_updated_at?: string | null
          profile_photo_url?: string | null
          rating?: number | null
          review_count?: number | null
          role?: string | null
          suspended?: boolean | null
          swift_code?: string | null
          updated_at?: string | null
          user_type?: string | null
          vat_number?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string
          created_at: string
          event_id: string
          host_id: string
          id: string
          rating: number
          review_text: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          booking_id: string
          created_at?: string
          event_id: string
          host_id: string
          id?: string
          rating: number
          review_text?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          event_id?: string
          host_id?: string
          id?: string
          rating?: number
          review_text?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_emails: {
        Row: {
          booking_id: string | null
          created_at: string
          error_message: string | null
          event_id: string | null
          id: string
          metadata: Json | null
          processed_at: string | null
          status: string
          trigger_date: string
          type: string
          user_id: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          error_message?: string | null
          event_id?: string | null
          id?: string
          metadata?: Json | null
          processed_at?: string | null
          status?: string
          trigger_date: string
          type: string
          user_id?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          error_message?: string | null
          event_id?: string | null
          id?: string
          metadata?: Json | null
          processed_at?: string | null
          status?: string
          trigger_date?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_emails_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_emails_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorites: {
        Row: {
          created_at: string
          event_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_host_frequency: {
        Args: { host_user_id: string }
        Returns: {
          avg_frequency_days: number
          events_per_year: number
          last_event: string
        }[]
      }
      calculate_host_payouts: {
        Args: { start_date: string; end_date: string }
        Returns: {
          host_id: string
          host_name: string
          event_count: number
          gross_amount: number
          commission_amount: number
          net_amount: number
          has_payout_details: boolean
        }[]
      }
      fix_orphaned_booking: {
        Args: { booking_ref: string; target_user_id: string }
        Returns: boolean
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      increment_event_spots: {
        Args: { event_id: string; spots_to_add: number }
        Returns: undefined
      }
      recalculate_all_event_spots: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      recalculate_event_spots_left: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_event_capacity: {
        Args: { event_id: string; new_capacity: number }
        Returns: undefined
      }
      update_host_frequency_metrics: {
        Args: { host_user_id: string }
        Returns: undefined
      }
      update_host_rating: {
        Args: { host_user_id: string }
        Returns: undefined
      }
      validate_iban: {
        Args: { iban_input: string }
        Returns: boolean
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
