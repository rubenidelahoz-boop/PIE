import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL
  ?? 'https://wkeraovmgenztczbgblo.supabase.co';

const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZXJhb3ZtZ2VuenRjemJnYmxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2ODYyMDMsImV4cCI6MjA4OTI2MjIwM30.DnVJII2fxZl-7kq0mmQ4JyovDdfVapeBKVCKrbEJwQQ';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
