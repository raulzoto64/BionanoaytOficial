export type LeadType = 'exit-intent' | 'quote' | 'contact';

export type LeadStatus = 'new' | 'contacted' | 'in_progress' | 'closed';

export interface LeadData {
  id?: number;
  name: string;
  last_name?: string;
  email: string;
  phone?: string;
  message?: string;
  lead_type: LeadType;
  page_url?: string;
  referrer?: string;
  user_agent?: string;
  status?: LeadStatus;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}