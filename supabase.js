import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://wpsgjzqbwpyfpmdawwnn.supabase.co";

const SUPABASE_KEY = "sb_publishable_flgB5CSE4scG3m3Fyx5lUA_GfLn6xh6";

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
