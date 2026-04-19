import { LeadData } from '../components/popups/types';
import { supabaseAPI } from '../data/supabase';
import { useVisitor } from './useVisitor';
import { useAuth } from './useAuth';

export function useLeads() {
  const { visitorId } = useVisitor();
  const { user } = useAuth();

  const createLead = async (data: LeadData) => {
    try {
      const leadData = await supabaseAPI.createLead({
        ...data,
        page_url: window.location.href,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
        is_anonymous: !user,
        user_id: user?.id || null,
        visitor_id: visitorId || null
      });

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
