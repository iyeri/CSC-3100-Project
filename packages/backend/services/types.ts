export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      books: {
        Row: {
          author: string | null;
          description: string | null;
          genre: string | null;
          isbn: string;
          title: string | null;
        };
        Insert: {
          author?: string | null;
          description?: string | null;
          genre?: string | null;
          isbn: string;
          title?: string | null;
        };
        Update: {
          author?: string | null;
          description?: string | null;
          genre?: string | null;
          isbn?: string;
          title?: string | null;
        };
        Relationships: [];
      };
      listings: {
        Row: {
          availability: string;
          condition: string | null;
          date_posted: string | null;
          isbn: string;
          lender: string;
          listing_id: string;
        };
        Insert: {
          availability: string;
          condition?: string | null;
          date_posted?: string | null;
          isbn?: string;
          lender: string;
          listing_id?: string;
        };
        Update: {
          availability?: string;
          condition?: string | null;
          date_posted?: string | null;
          isbn?: string;
          lender?: string;
          listing_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Book Listing_isbn_fkey";
            columns: ["isbn"];
            isOneToOne: false;
            referencedRelation: "books";
            referencedColumns: ["isbn"];
          },
          {
            foreignKeyName: "Book Listing_lender_fkey";
            columns: ["lender"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["uid"];
          },
        ];
      };
      loans: {
        Row: {
          borrower: string;
          date_lended: string | null;
          due_date: string | null;
          is_overdue: boolean | null;
          isbn: string;
          lender: string;
          listing_id: string;
          loan_id: string;
        };
        Insert: {
          borrower: string;
          date_lended?: string | null;
          due_date?: string | null;
          is_overdue?: boolean | null;
          isbn?: string;
          lender: string;
          listing_id: string;
          loan_id?: string;
        };
        Update: {
          borrower?: string;
          date_lended?: string | null;
          due_date?: string | null;
          is_overdue?: boolean | null;
          isbn?: string;
          lender?: string;
          listing_id?: string;
          loan_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Book Loan_borrower_fkey";
            columns: ["borrower"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["uid"];
          },
          {
            foreignKeyName: "Book Loan_isbn_fkey";
            columns: ["isbn"];
            isOneToOne: false;
            referencedRelation: "books";
            referencedColumns: ["isbn"];
          },
          {
            foreignKeyName: "Book Loan_lender_fkey";
            columns: ["lender"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["uid"];
          },
          {
            foreignKeyName: "Book Loan_listing_id_fkey";
            columns: ["listing_id"];
            isOneToOne: false;
            referencedRelation: "listings";
            referencedColumns: ["listing_id"];
          },
        ];
      };
      users: {
        Row: {
          account_status: string | null;
          bio: string | null;
          calpoly_email: string;
          credit_balance: number;
          date_joined: string | null;
          name: string | null;
          on_campus: boolean | null;
          pfp_url: string | null;
          uid: string;
          username: string;
        };
        Insert: {
          account_status?: string | null;
          bio?: string | null;
          calpoly_email: string;
          credit_balance?: number;
          date_joined?: string | null;
          name?: string | null;
          on_campus?: boolean | null;
          pfp_url?: string | null;
          uid?: string;
          username?: string;
        };
        Update: {
          account_status?: string | null;
          bio?: string | null;
          calpoly_email?: string;
          credit_balance?: number;
          date_joined?: string | null;
          name?: string | null;
          on_campus?: boolean | null;
          pfp_url?: string | null;
          uid?: string;
          username?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
