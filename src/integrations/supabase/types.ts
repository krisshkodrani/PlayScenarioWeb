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
      connection_metrics_logs: {
        Row: {
          active_connections: number | null
          id: number
          log_time: string
          total_connections: number | null
        }
        Insert: {
          active_connections?: number | null
          id?: number
          log_time?: string
          total_connections?: number | null
        }
        Update: {
          active_connections?: number | null
          id?: number
          log_time?: string
          total_connections?: number | null
        }
        Relationships: []
      }
      credit_audit_logs: {
        Row: {
          created_at: string
          credits_change: number | null
          id: number
          reason: string | null
          transaction_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          credits_change?: number | null
          id?: number
          reason?: string | null
          transaction_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          credits_change?: number | null
          id?: number
          reason?: string | null
          transaction_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      instance_messages: {
        Row: {
          dislike_count: number
          id: string
          instance_id: string
          like_count: number
          message: string
          message_type: string
          sender_name: string
          timestamp: string
          turn_number: number
        }
        Insert: {
          dislike_count?: number
          id?: string
          instance_id: string
          like_count?: number
          message: string
          message_type?: string
          sender_name: string
          timestamp?: string
          turn_number: number
        }
        Update: {
          dislike_count?: number
          id?: string
          instance_id?: string
          like_count?: number
          message?: string
          message_type?: string
          sender_name?: string
          timestamp?: string
          turn_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "instance_messages_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "scenario_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      message_reactions: {
        Row: {
          created_at: string
          id: string
          message_id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_id: string
          reaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message_id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "instance_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          credits: number
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          created_at?: string
          credits?: number
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          credits?: number
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      query_performance_logs: {
        Row: {
          duration_ms: number | null
          id: number
          log_time: string
          query: string | null
          user_id: string | null
        }
        Insert: {
          duration_ms?: number | null
          id?: number
          log_time?: string
          query?: string | null
          user_id?: string | null
        }
        Update: {
          duration_ms?: number | null
          id?: number
          log_time?: string
          query?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      rls_violation_logs: {
        Row: {
          id: number
          operation: string | null
          row_id: string | null
          table_name: string | null
          user_id: string | null
          violation_time: string
        }
        Insert: {
          id?: number
          operation?: string | null
          row_id?: string | null
          table_name?: string | null
          user_id?: string | null
          violation_time?: string
        }
        Update: {
          id?: number
          operation?: string | null
          row_id?: string | null
          table_name?: string | null
          user_id?: string | null
          violation_time?: string
        }
        Relationships: []
      }
      scenario_bookmarks: {
        Row: {
          created_at: string
          id: string
          scenario_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          scenario_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          scenario_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scenario_bookmarks_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      scenario_characters: {
        Row: {
          backstory: string | null
          created_at: string
          expertise_keywords: string[]
          id: string
          is_player_character: boolean
          motivations: string | null
          name: string
          personality: string
          relationships: Json
          role: string
          scenario_id: string
          speech_patterns: string | null
        }
        Insert: {
          backstory?: string | null
          created_at?: string
          expertise_keywords?: string[]
          id?: string
          is_player_character?: boolean
          motivations?: string | null
          name: string
          personality: string
          relationships?: Json
          role?: string
          scenario_id: string
          speech_patterns?: string | null
        }
        Update: {
          backstory?: string | null
          created_at?: string
          expertise_keywords?: string[]
          id?: string
          is_player_character?: boolean
          motivations?: string | null
          name?: string
          personality?: string
          relationships?: Json
          role?: string
          scenario_id?: string
          speech_patterns?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scenario_characters_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      scenario_instances: {
        Row: {
          completion_reason: string | null
          current_turn: number
          ended_at: string | null
          final_score: number | null
          id: string
          lose_condition_met: boolean | null
          max_turns: number | null
          objectives_progress: Json
          scenario_id: string
          started_at: string
          status: string
          user_id: string
          win_condition_met: boolean | null
        }
        Insert: {
          completion_reason?: string | null
          current_turn?: number
          ended_at?: string | null
          final_score?: number | null
          id?: string
          lose_condition_met?: boolean | null
          max_turns?: number | null
          objectives_progress?: Json
          scenario_id: string
          started_at?: string
          status?: string
          user_id: string
          win_condition_met?: boolean | null
        }
        Update: {
          completion_reason?: string | null
          current_turn?: number
          ended_at?: string | null
          final_score?: number | null
          id?: string
          lose_condition_met?: boolean | null
          max_turns?: number | null
          objectives_progress?: Json
          scenario_id?: string
          started_at?: string
          status?: string
          user_id?: string
          win_condition_met?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "scenario_instances_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      scenario_likes: {
        Row: {
          created_at: string
          id: string
          scenario_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          scenario_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          scenario_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scenario_likes_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      scenarios: {
        Row: {
          average_score: number | null
          bookmark_count: number
          created_at: string
          creator_id: string
          description: string
          id: string
          initial_scene_prompt: string
          is_public: boolean
          like_count: number
          lose_conditions: string | null
          max_turns: number | null
          objectives: Json
          play_count: number
          title: string
          updated_at: string
          win_conditions: string | null
        }
        Insert: {
          average_score?: number | null
          bookmark_count?: number
          created_at?: string
          creator_id: string
          description: string
          id?: string
          initial_scene_prompt: string
          is_public?: boolean
          like_count?: number
          lose_conditions?: string | null
          max_turns?: number | null
          objectives?: Json
          play_count?: number
          title: string
          updated_at?: string
          win_conditions?: string | null
        }
        Update: {
          average_score?: number | null
          bookmark_count?: number
          created_at?: string
          creator_id?: string
          description?: string
          id?: string
          initial_scene_prompt?: string
          is_public?: boolean
          like_count?: number
          lose_conditions?: string | null
          max_turns?: number | null
          objectives?: Json
          play_count?: number
          title?: string
          updated_at?: string
          win_conditions?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_credits: {
        Args: { user_id: string; amount: number; description?: string }
        Returns: undefined
      }
      deduct_credits: {
        Args: {
          user_id: string
          amount: number
          reason: string
          instance_id?: string
        }
        Returns: boolean
      }
      log_rls_violation: {
        Args: {
          table_name: string
          user_id: string
          operation: string
          row_id: string
        }
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
