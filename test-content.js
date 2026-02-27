import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jzmdfoptxmqywihyhoty.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_jIQS9Mg3gRqdIE8BJe4s4Q_3-iqvH15";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testGetPageContent() {
  try {
    console.log('Testing getPageContent...');
    
    // Get Spanish content
    const { data: contentES, error: errorES } = await supabase
      .from("page_contents")
      .select("*")
      .eq("page_id", "page-home")
      .eq("language", "es")
      .single();
    
    if (errorES) {
      console.error('Error getting Spanish content:', errorES);
    } else {
      console.log('Spanish content sections:', contentES.sections);
      console.log('Spanish sections types:', contentES.sections.map(section => ({ id: section.id, type: section.type, order: section.order })));
    }
    
    // Get English content
    const { data: contentEN, error: errorEN } = await supabase
      .from("page_contents")
      .select("*")
      .eq("page_id", "page-home")
      .eq("language", "en")
      .single();
    
    if (errorEN) {
      console.error('Error getting English content:', errorEN);
    } else {
      console.log('English content sections:', contentEN.sections);
      console.log('English sections types:', contentEN.sections.map(section => ({ id: section.id, type: section.type, order: section.order })));
    }
    
  } catch (error) {
    console.error('General error:', error);
  }
}

testGetPageContent();