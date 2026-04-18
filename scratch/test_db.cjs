const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://jzmdfoptxmqywihyhoty.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_jIQS9Mg3gRqdIE8BJe4s4Q_3-iqvH15";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
async function checkDb() {
  console.log('Checking notifications...');
  const { data: notifs, error: notifsError } = await supabase.from('notifications').select('*').limit(5);
  console.log('Notifs:', notifs?.length, notifsError ? notifsError.message : '');

  console.log('Checking analytics...');
  const { data: analytics, error: analyticsError } = await supabase.from('site_analytics').select('*').limit(5);
  console.log('Analytics:', analytics?.length, analyticsError ? analyticsError.message : '');

  const { data: rpc, error: rpcError } = await supabase.rpc('get_funnel_stats', { start_date: '2020-01-01T00:00:00Z', end_date: '2030-01-01T00:00:00Z' });
  console.log('RPC result:', rpc, rpcError ? rpcError.message : '');
}
checkDb();
