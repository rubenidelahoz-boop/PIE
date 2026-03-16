import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  ?? 'https://wkeraovmgenztczbgblo.supabase.co';

const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZXJhb3ZtZ2VuenRjemJnYmxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2ODYyMDMsImV4cCI6MjA4OTI2MjIwM30.DnVJII2fxZl-7kq0mmQ4JyovDdfVapeBKVCKrbEJwQQ';

// Sin tipo genérico Database para evitar conflictos de tipado con Supabase v2
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase = createClient(supabaseUrl, supabaseKey);
