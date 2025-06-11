import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qdngrbwcigyfdwsnkkoq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkbmdyYndjaWd5ZmR3c25ra29xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyMTYzMDUsImV4cCI6MjA2NDc5MjMwNX0.KMF-Btmyx5Wb0lZ7DGBDuza4GG4MgiYDuglaq7vM2fo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);