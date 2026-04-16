import { LeadData, LeadType } from '../components/popups/types';
import { supabase } from '../data/supabase';
import { useVisitor } from './useVisitor';

export function useLeads() {
  const { visitorId } = useVisitor();
  const createLead = async (data: LeadData) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      const { data: leadData, error } = await supabase
        .from('leads')
        .insert([{
          ...data,
          page_url: window.location.href,
          referrer: document.referrer,
          user_agent: navigator.userAgent,
          ip_address: (await supabase.rpc('get_ip_address')).data.ip,
          is_anonymous: !user,
          user_id: user?.user?.id || null,
          visitor_id: visitorId || null
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return leadData;
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
  };

  return {
    createLead
  };
}
