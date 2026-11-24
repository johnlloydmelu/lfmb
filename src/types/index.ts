
export interface Memory extends Record<string, unknown> {
  id: string;
  image_path: string;
  caption: string;
  memory_date: string;
  created_at: string;
}

export interface TimelineEvent extends Record<string, unknown> {
  id: string;
  title: string;
  description: string;
  event_date: string;
  created_at: string;
}

export interface MemoryInsert extends Record<string, unknown> {
  image_path: string;
  caption: string;
  memory_date: string;
}

export interface TimelineEventInsert extends Record<string, unknown> {
  title: string;
  description: string;
  event_date: string;
}

export interface Database {
  public: {
    Tables: {
      memories: {
        Row: Memory;
        Insert: MemoryInsert;
        Update: Partial<MemoryInsert>;
        Relationships: [];
      };
      timeline_events: {
        Row: TimelineEvent;
        Insert: TimelineEventInsert;
        Update: Partial<TimelineEventInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
  // Supabase JS v2.119+ expects generated schema metadata at the root.
  __InternalSupabase: {
    PostgrestVersion: "12.2.3";
  };
}

export interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  rotation: number;
  size: number;
}
