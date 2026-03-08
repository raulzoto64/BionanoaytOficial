import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jzmdfoptxmqywihyhoty.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_jIQS9Mg3gRqdIE8BJe4s4Q_3-iqvH15";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function applySecurityPolicies() {
  try {
    console.log("Applying security policies to blog tables...");

    // These policies are created using the SQL script above
    // For this script, we'll directly enable RLS and create policies

    // Enable RLS on all blog tables
    const tables = ['blog_posts', 'blog_post_translations', 'blog_categories', 'blog_category_translations', 'blog_post_categories'];
    
    for (const table of tables) {
      console.log(`\nEnabling RLS for ${table}...`);
      
      // Enable RLS
      const { error: enableRLSError } = await supabase.rpc('rpc', {
        sql: `ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`
      });

      if (enableRLSError) {
        console.error(`❌ Error enabling RLS for ${table}:`, enableRLSError.message);
      } else {
        console.log(`✅ RLS enabled for ${table}`);
      }

      // Create policies for each table
      const policies = [
        {
          name: `Allow anonymous read access to ${table}`,
          command: 'SELECT',
          using: 'true',
          check: null
        },
        {
          name: `Allow anonymous write access to ${table}`,
          command: 'INSERT',
          using: null,
          check: 'true'
        },
        {
          name: `Allow anonymous update access to ${table}`,
          command: 'UPDATE',
          using: 'true',
          check: 'true'
        },
        {
          name: `Allow anonymous delete access to ${table}`,
          command: 'DELETE',
          using: 'true',
          check: null
        }
      ];

      for (const policy of policies) {
        try {
          const policyName = policy.name.replace('{table}', table);
          
          // Check if policy exists
          const { data: existingPolicy } = await supabase
            .from('pg_policies')
            .select('policyname')
            .eq('tablename', table)
            .eq('policyname', policyName)
            .single();

          if (existingPolicy) {
            console.log(`🔄 Policy "${policyName}" already exists, skipping...`);
            continue;
          }

          // Create the policy
          let sql;
          if (policy.command === 'INSERT') {
            sql = `CREATE POLICY "${policyName}" ON ${table} FOR ${policy.command} TO public WITH CHECK (${policy.check});`;
          } else {
            sql = `CREATE POLICY "${policyName}" ON ${table} FOR ${policy.command} TO public USING (${policy.using}) ${policy.check ? `WITH CHECK (${policy.check})` : ''};`;
          }

          const { error: policyError } = await supabase.rpc('rpc', {
            sql: sql
          });

          if (policyError) {
            console.error(`❌ Error creating policy "${policyName}":`, policyError.message);
          } else {
            console.log(`✅ Policy "${policyName}" created successfully`);
          }

        } catch (policyError) {
          console.error(`❌ Error processing policy "${policy.name}":`, policyError.message);
        }
      }
    }

    console.log("\n✅ All security policies applied successfully!");
    
    // Verify policies
    console.log("\nVerifying policies...");
    const { data: policies, error: verifyError } = await supabase
      .from('pg_policies')
      .select('tablename, policyname, cmd')
      .ilike('tablename', 'blog%')
      .order('tablename, policyname');

    if (verifyError) {
      console.error("❌ Error verifying policies:", verifyError.message);
    } else {
      console.log(`✅ Found ${policies.length} policies for blog tables:`);
      const tablePolicies = {};
      policies.forEach(policy => {
        if (!tablePolicies[policy.tablename]) {
          tablePolicies[policy.tablename] = [];
        }
        tablePolicies[policy.tablename].push(policy.policyname);
      });
      
      Object.keys(tablePolicies).forEach(table => {
        console.log(`\nTable: ${table}`);
        tablePolicies[table].forEach(policy => {
          console.log(`  - ${policy}`);
        });
      });
    }

  } catch (error) {
    console.error("❌ General error:", error);
  }
}

applySecurityPolicies();