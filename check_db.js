const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://jzmdfoptxmqywihyhoty.supabase.co', 'sb_publishable_jIQS9Mg3gRqdIE8BJe4s4Q_3-iqvH15');

async function checkPageContents() {
  try {
    const { data, error } = await supabase
      .from('page_contents')
      .select('*')
      .eq('page_id', 'page-home');
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    console.log('Page contents for page-home:');
    data.forEach(item => {
      console.log('\nLanguage:', item.language);
      console.log('Sections:', item.sections.length);
      item.sections.forEach(section => {
        console.log('  -', section.type + ':', section.content?.title || 'No title');
      });
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

checkPageContents();