import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jzmdfoptxmqywihyhoty.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_jIQS9Mg3gRqdIE8BJe4s4Q_3-iqvH15";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testBlogTables() {
  try {
    console.log("Testing blog tables in Supabase...");
    
    // Test blog posts table
    const { data: blogPosts, error: blogPostsError } = await supabase
      .from("blog_posts")
      .select("*")
      .limit(5);
      
    if (blogPostsError) {
      console.error("❌ Error accessing blog_posts table:", blogPostsError);
    } else {
      console.log(`✅ Blog posts found: ${blogPosts.length}`);
      console.log(blogPosts);
    }
    
    // Test blog categories table
    const { data: blogCategories, error: blogCategoriesError } = await supabase
      .from("blog_categories")
      .select("*")
      .limit(5);
      
    if (blogCategoriesError) {
      console.error("❌ Error accessing blog_categories table:", blogCategoriesError);
    } else {
      console.log(`✅ Blog categories found: ${blogCategories.length}`);
      console.log(blogCategories);
    }
    
    // Test blog post translations table
    const { data: blogPostTranslations, error: blogPostTranslationsError } = await supabase
      .from("blog_post_translations")
      .select("*")
      .limit(5);
      
    if (blogPostTranslationsError) {
      console.error("❌ Error accessing blog_post_translations table:", blogPostTranslationsError);
    } else {
      console.log(`✅ Blog post translations found: ${blogPostTranslations.length}`);
      console.log(blogPostTranslations);
    }
    
    // Test blog category translations table
    const { data: blogCategoryTranslations, error: blogCategoryTranslationsError } = await supabase
      .from("blog_category_translations")
      .select("*")
      .limit(5);
      
    if (blogCategoryTranslationsError) {
      console.error("❌ Error accessing blog_category_translations table:", blogCategoryTranslationsError);
    } else {
      console.log(`✅ Blog category translations found: ${blogCategoryTranslations.length}`);
      console.log(blogCategoryTranslations);
    }
    
    // Test blog post categories relationship table
    const { data: blogPostCategories, error: blogPostCategoriesError } = await supabase
      .from("blog_post_categories")
      .select("*")
      .limit(5);
      
    if (blogPostCategoriesError) {
      console.error("❌ Error accessing blog_post_categories table:", blogPostCategoriesError);
    } else {
      console.log(`✅ Blog post categories relationships found: ${blogPostCategories.length}`);
      console.log(blogPostCategories);
    }
    
  } catch (error) {
    console.error("General error:", error);
  }
}

testBlogTables();