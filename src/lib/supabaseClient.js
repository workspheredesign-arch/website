import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ocirdnajtwkjiixjuzqg.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_91QY7yAbCOccpO3HPt98Tw_fE9YSQUd';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
export const BUCKET = 'portfolio';