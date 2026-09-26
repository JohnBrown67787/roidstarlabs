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

/**
 * Save card payment to Supabase table 'payments' (or 'orders' fallback).
 */
export async function createSupabasePayment(paymentData) {
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert([paymentData])
      .select();

    if (error) {
      // Fallback to orders table if payments table isn't created yet
      return await createSupabaseOrder({
        order_id: paymentData.order_id || `PAY-${Date.now().toString().slice(-6)}`,
        customer_name: paymentData.name,
        customer_email: paymentData.email || 'customer@card-payment.com',
        customer_phone: paymentData.phone || '',
        shipping_address: 'Direct Card Payment',
        city: 'Card Payment',
        state: 'US',
        zip_code: '00000',
        order_items: [{ name: `Card Payment for Order #${paymentData.order_number || 'N/A'}`, quantity: 1, price: paymentData.amount || 0 }],
        total_amount: paymentData.amount || 0,
        status: 'paid'
      });
    }
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}


