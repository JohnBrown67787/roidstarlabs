import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ehxhgpgyminvyvebbqlg.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Fetch products from Supabase table 'products'.
 * Falls back gracefully if table does not exist yet.
 */
export async function fetchSupabaseProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      console.warn('Supabase products fetch warning:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase fetch exception:', err);
    return null;
  }
}

/**
 * Save an order to Supabase table 'orders'.
 */
export async function createSupabaseOrder(orderData) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select();

    if (error) {
      console.warn('Supabase order insert warning:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
