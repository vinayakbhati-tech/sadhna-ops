import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xpglduajmcosoohrngcr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwZ2xkdWFqbWNvc29vaHJuZ2NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyNzg0MjcsImV4cCI6MjEwNTg1NDQyN30.38-dbsTkzjIEODLz4ghoeQ6UcRJna1a3nn4EvD11_mU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)