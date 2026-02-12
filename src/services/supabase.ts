import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://uwroowxlvfwckdawfaki.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3cm9vd3hsdmZ3Y2tkYXdmYWtpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDY0MTUwMSwiZXhwIjoyMDg2MjE3NTAxfQ.IWtFuz8i30jpOzGJgUdZt6vR9Bh0eTyxNrWXYrGq4VI";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
