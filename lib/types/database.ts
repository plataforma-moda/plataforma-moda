export type Database = {
  public: {
    Tables: {
      fornecedores: {
        Row: {
          id: string
          user_id: string | null
          nome: string
          razao_social: string | null
          cnpj: string | null
          telefone: string | null
          celular: string | null
          whatsapp: string | null
          email: string | null
          cep: string | null
          endereco: string | null
          bairro: string | null
          cidade: string | null
          estado: string | null
          category_id: number | null
          subcategory_id: number | null
          specialization_id: number | null
          categoria_nome: string | null
          subcategoria_nome: string | null
          especializacao_nome: string | null
          capacidade_produtiva: string | null
          moq: string | null
          prazo_medio_dias: string | null
          certificacoes: string | null
          descricao: string | null
          status: string | null
          polo_id: number | null
          polo_textil: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          nome: string
          razao_social?: string | null
          cnpj?: string | null
          telefone?: string | null
          celular?: string | null
          whatsapp?: string | null
          email?: string | null
          cep?: string | null
          endereco?: string | null
          bairro?: string | null
          cidade?: string | null
          estado?: string | null
          category_id?: number | null
          subcategory_id?: number | null
          specialization_id?: number | null
          categoria_nome?: string | null
          subcategoria_nome?: string | null
          especializacao_nome?: string | null
          capacidade_produtiva?: string | null
          moq?: string | null
          prazo_medio_dias?: string | null
          certificacoes?: string | null
          descricao?: string | null
          status?: string | null
          polo_id?: number | null
          polo_textil?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          nome?: string
          razao_social?: string | null
          cnpj?: string | null
          telefone?: string | null
          celular?: string | null
          whatsapp?: string | null
          email?: string | null
          cep?: string | null
          endereco?: string | null
          bairro?: string | null
          cidade?: string | null
          estado?: string | null
          category_id?: number | null
          subcategory_id?: number | null
          specialization_id?: number | null
          categoria_nome?: string | null
          subcategoria_nome?: string | null
          especializacao_nome?: string | null
          capacidade_produtiva?: string | null
          moq?: string | null
          prazo_medio_dias?: string | null
          certificacoes?: string | null
          descricao?: string | null
          status?: string | null
          polo_id?: number | null
          polo_textil?: string | null
        }
      }
      fornecedor_categorias: {
        Row: {
          id: number
          fornecedor_id: string
          category_id: number | null
          subcategory_id: number | null
          specialization_id: number | null
          categoria_nome: string | null
          subcategoria_nome: string | null
          especializacao_nome: string | null
        }
        Insert: {
          id?: number
          fornecedor_id: string
          category_id?: number | null
          subcategory_id?: number | null
          specialization_id?: number | null
          categoria_nome?: string | null
          subcategoria_nome?: string | null
          especializacao_nome?: string | null
        }
        Update: {
          id?: number
          fornecedor_id?: string
          category_id?: number | null
          subcategory_id?: number | null
          specialization_id?: number | null
          categoria_nome?: string | null
          subcategoria_nome?: string | null
          especializacao_nome?: string | null
        }
      }
      categories: {
        Row: { id: number; name: string }
        Insert: { id?: number; name: string }
        Update: { id?: number; name?: string }
      }
      subcategories: {
        Row: { id: number; name: string; category_id: number }
        Insert: { id?: number; name: string; category_id: number }
        Update: { id?: number; name?: string; category_id?: number }
      }
      specializations: {
        Row: { id: number; name: string; subcategory_id: number }
        Insert: { id?: number; name: string; subcategory_id: number }
        Update: { id?: number; name?: string; subcategory_id?: number }
      }
      polos_texteis: {
        Row: { id: number; nome: string; estado: string }
        Insert: { id?: number; nome: string; estado: string }
        Update: { id?: number; nome?: string; estado?: string }
      }
      clientes: {
        Row: {
          id: string
          user_id: string | null
          nome: string
          email: string
          telefone: string | null
          whatsapp: string | null
          empresa: string | null
          cnpj: string | null
          estado: string | null
          cidade: string | null
          segmento_interesse: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          nome: string
          email: string
          telefone?: string | null
          whatsapp?: string | null
          empresa?: string | null
          cnpj?: string | null
          estado?: string | null
          cidade?: string | null
          segmento_interesse?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          nome?: string
          email?: string
          telefone?: string | null
          whatsapp?: string | null
          empresa?: string | null
          cnpj?: string | null
          estado?: string | null
          cidade?: string | null
          segmento_interesse?: string | null
        }
      }
      cotacoes: {
        Row: {
          id: string
          fornecedor_id: string
          fornecedor_nome: string | null
          nome_comprador: string
          empresa_comprador: string | null
          email_comprador: string
          telefone_comprador: string | null
          produto: string
          quantidade: string | null
          prazo_desejado: string | null
          descricao: string | null
          status: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          fornecedor_id: string
          fornecedor_nome?: string | null
          nome_comprador: string
          empresa_comprador?: string | null
          email_comprador: string
          telefone_comprador?: string | null
          produto: string
          quantidade?: string | null
          prazo_desejado?: string | null
          descricao?: string | null
          status?: string | null
        }
        Update: {
          id?: string
          fornecedor_id?: string
          fornecedor_nome?: string | null
          nome_comprador?: string
          empresa_comprador?: string | null
          email_comprador?: string
          telefone_comprador?: string | null
          produto?: string
          quantidade?: string | null
          prazo_desejado?: string | null
          descricao?: string | null
          status?: string | null
        }
      }
      subscriptions: {
        Row: {
          id: string
          fornecedor_id: string
          user_id: string | null
          plan_id: number
          status: string
          price_id: number | null
          gateway: string | null
          mp_preference_id: string | null
          mp_payment_id: string | null
          mp_preapproval_id: string | null
          period_start: string | null
          period_end: string | null
          cancel_at: string | null
          canceled_at: string | null
          trial_end: string | null
          metadata: Record<string, unknown> | null
          created_at: string | null
        }
        Insert: {
          id?: string
          fornecedor_id: string
          user_id?: string | null
          plan_id: number
          status: string
          price_id?: number | null
          gateway?: string | null
          mp_preference_id?: string | null
          mp_payment_id?: string | null
          mp_preapproval_id?: string | null
          period_start?: string | null
          period_end?: string | null
          cancel_at?: string | null
          canceled_at?: string | null
          trial_end?: string | null
          metadata?: Record<string, unknown> | null
        }
        Update: {
          id?: string
          fornecedor_id?: string
          user_id?: string | null
          plan_id?: number
          status?: string
          price_id?: number | null
          gateway?: string | null
          mp_preference_id?: string | null
          mp_payment_id?: string | null
          mp_preapproval_id?: string | null
          period_start?: string | null
          period_end?: string | null
          cancel_at?: string | null
          canceled_at?: string | null
          trial_end?: string | null
          metadata?: Record<string, unknown> | null
        }
      }
      terms_acceptances: {
        Row: {
          id: string
          user_id: string | null
          entity_type: 'fornecedor' | 'cliente' | 'plano'
          entity_id: string | null
          terms_version: string
          ip_address: string | null
          user_agent: string | null
          accepted_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          entity_type: 'fornecedor' | 'cliente' | 'plano'
          entity_id?: string | null
          terms_version?: string
          ip_address?: string | null
          user_agent?: string | null
          accepted_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          entity_type?: 'fornecedor' | 'cliente' | 'plano'
          entity_id?: string | null
          terms_version?: string
          ip_address?: string | null
          user_agent?: string | null
          accepted_at?: string
        }
      }
      plans: {
        Row: {
          id: number
          slug: string
          name: string
          description: string | null
          is_active: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: number
          slug: string
          name: string
          description?: string | null
          is_active?: boolean
          sort_order?: number
        }
        Update: {
          id?: number
          slug?: string
          name?: string
          description?: string | null
          is_active?: boolean
          sort_order?: number
        }
      }
      plan_prices: {
        Row: {
          id: number
          plan_id: number
          interval: string
          price_cents: number
          currency: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: number
          plan_id: number
          interval: string
          price_cents: number
          currency?: string
          is_active?: boolean
        }
        Update: {
          id?: number
          plan_id?: number
          interval?: string
          price_cents?: number
          currency?: string
          is_active?: boolean
        }
      }
      entitlements: {
        Row: {
          id: number
          plan_id: number
          feature_key: string
          feature_value: string
        }
        Insert: {
          id?: number
          plan_id: number
          feature_key: string
          feature_value: string
        }
        Update: {
          id?: number
          plan_id?: number
          feature_key?: string
          feature_value?: string
        }
      }
      billing_customers: {
        Row: {
          id: string
          fornecedor_id: string
          mp_customer_id: string | null
          mp_payer_email: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          fornecedor_id: string
          mp_customer_id?: string | null
          mp_payer_email?: string | null
        }
        Update: {
          fornecedor_id?: string
          mp_customer_id?: string | null
          mp_payer_email?: string | null
        }
      }
      subscription_events: {
        Row: {
          id: string
          subscription_id: string | null
          fornecedor_id: string | null
          event_type: string
          gateway: string | null
          gateway_event_id: string | null
          payload: Record<string, unknown> | null
          processed_at: string | null
          error: string | null
          created_at: string
        }
        Insert: {
          id?: string
          subscription_id?: string | null
          fornecedor_id?: string | null
          event_type: string
          gateway?: string | null
          gateway_event_id?: string | null
          payload?: Record<string, unknown> | null
          processed_at?: string | null
          error?: string | null
        }
        Update: {
          subscription_id?: string | null
          fornecedor_id?: string | null
          event_type?: string
          gateway?: string | null
          gateway_event_id?: string | null
          payload?: Record<string, unknown> | null
          processed_at?: string | null
          error?: string | null
        }
      }
    }
  }
}
