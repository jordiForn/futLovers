export type MatchStatus = 'open' | 'cancelled' | 'completed';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          avatar_url: string | null;
          level: number;
          reliability_score: number;
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          avatar_url?: string | null;
          level?: number;
          reliability_score?: number;
          created_at?: string;
        };
        Update: {
          username?: string;
          avatar_url?: string | null;
        };
        Relationships: [];
      };
      venues: {
        Row: {
          id: string;
          name: string;
          city: string;
          address: string | null;
          latitude: number | null;
          longitude: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          city: string;
          address?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          city?: string;
          address?: string | null;
          latitude?: number | null;
          longitude?: number | null;
        };
        Relationships: [];
      };
      fields: {
        Row: {
          id: string;
          venue_id: string;
          name: string;
          modality: string;
          capacity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          venue_id: string;
          name: string;
          modality?: string;
          capacity?: number;
          created_at?: string;
        };
        Update: {
          venue_id?: string;
          name?: string;
          modality?: string;
          capacity?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'fields_venue_id_fkey';
            columns: ['venue_id'];
            isOneToOne: false;
            referencedRelation: 'venues';
            referencedColumns: ['id'];
          },
        ];
      };
      matches: {
        Row: {
          id: string;
          created_by: string;
          field_id: string | null;
          starts_at: string;
          modality: string;
          capacity: number;
          min_level: number | null;
          max_level: number | null;
          status: MatchStatus;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          created_by: string;
          field_id?: string | null;
          starts_at: string;
          modality?: string;
          capacity?: number;
          min_level?: number | null;
          max_level?: number | null;
          status?: MatchStatus;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          field_id?: string | null;
          starts_at?: string;
          modality?: string;
          capacity?: number;
          min_level?: number | null;
          max_level?: number | null;
          status?: MatchStatus;
          notes?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'matches_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'matches_field_id_fkey';
            columns: ['field_id'];
            isOneToOne: false;
            referencedRelation: 'fields';
            referencedColumns: ['id'];
          },
        ];
      };
      match_players: {
        Row: {
          id: string;
          match_id: string;
          player_id: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          match_id: string;
          player_id: string;
          joined_at?: string;
        };
        Update: {
          match_id?: string;
          player_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'match_players_match_id_fkey';
            columns: ['match_id'];
            isOneToOne: false;
            referencedRelation: 'matches';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'match_players_player_id_fkey';
            columns: ['player_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Venue = Database['public']['Tables']['venues']['Row'];
export type Field = Database['public']['Tables']['fields']['Row'];
export type Match = Database['public']['Tables']['matches']['Row'];
export type MatchPlayer = Database['public']['Tables']['match_players']['Row'];
