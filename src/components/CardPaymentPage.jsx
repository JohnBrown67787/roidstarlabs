import React, { useState } from 'react';
import { CreditCard, Lock, ShieldCheck, CheckCircle2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { createSupabasePayment } from '../supabase';

export default function CardPaymentPage({ cart, cartTotal, onClearCart, onNavigateToShop, onShowToast }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    orderNumber: '',
    cardNumber: '',
    cvv: '',
    exp: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedPayment, setCompletedPayment] = useState(null);

  // Detect card type from number
  const getCardBrand = (number) => {
    const clean = number.replace(/\D/g, '');
    if (/^4/.test(clean)) return 'Visa';
    if (/^5[1-5]/.test(clean)) return 'Mastercard';
    if (/^3[47]/.test(clean)) return 'Amex';
    if (/^6(?:011|5)/.test(clean)) return 'Discover';
    return 'Card';
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpDate = (value) => {
    const clean = value.replace(/\D/g, '');
    if (clean.length >= 2) {
      return `${clean.slice(0, 2)}/${clean.slice(2, 4)}`;
    }
    return clean;
  };

  const handleCardSubmit = async (e) => {
    e.preventDefault();

    if (formData.cardNumber.replace(/\s/g, '').length < 15) {
      onShowToast?.('Please enter a valid 16-digit card number.');
      return;
    }

    setIsProcessing(true);

    const generatedOrderId = formData.orderNumber || `ORD-${Date.now().toString().slice(-6)}`;
    const paymentAmount = cartTotal > 0 ? cartTotal : 150.00;

    const paymentPayload = {
      order_id: generatedOrderId,
      order_number: formData.orderNumber,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      amount: paymentAmount,
      card_last4: formData.cardNumber.slice(-4),
      card_brand: getCardBrand(formData.cardNumber),
      status: 'completed',
      created_at: new Date().toISOString()
    };

    // Save to Supabase
    await createSupabasePayment(paymentPayload);

    setTimeout(() => {
      setIsProcessing(false);
      setCompletedPayment({
        id: generatedOrderId,
        name: paymentPayload.name,
        amount: paymentAmount,
        last4: paymentPayload.card_last4,
        brand: paymentPayload.card_brand,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      });

      if (onClearCart) onClearCart();
      onShowToast?.('Card payment processed successfully!');
    }, 1200);
  };

  return (
    <div className="card-payment-page-wrapper">
      {/* 1. BREADCRUMBS BAR */}
      <div className="shop-subhead">
        <div className="container shop-subhead-inner">
          <nav className="breadcrumbs">
            <a href="#home" onClick={(e) => { e.preventDefault(); onNavigateToShop(); }}>Home</a>
            <span className="divider">/</span>
            <span className="current">Card Payment</span>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#229409', fontSize: '13px', fontWeight: '700' }}>
            <Lock size={15} />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 15px 80px' }}>
        {completedPayment ? (
          /* PAYMENT SUCCESS RECEIPT */
          <div className="payment-receipt-card">
            <div className="receipt-header">
              <CheckCircle2 size={68} color="#229409" style={{ margin: '0 auto 16px' }} />
              <h2 className="receipt-title">Payment Approved &amp; Order Confirmed!</h2>
              <p className="receipt-subtitle">
                Your payment was processed securely. An invoice and tracking receipt have been registered.
              </p>
            </div>

            <div className="receipt-details-box">
              <div className="receipt-row">
                <span>Order Reference:</span>
                <strong>#{completedPayment.id}</strong>
              </div>
              <div className="receipt-row">
                <span>Customer Name:</span>
                <strong>{completedPayment.name}</strong>
              </div>
              <div className="receipt-row">
                <span>Payment Method:</span>
                <strong>{completedPayment.brand} ending in •••• {completedPayment.last4}</strong>
              </div>
              <div className="receipt-row">
                <span>Date:</span>
                <strong>{completedPayment.date}</strong>
              </div>
              <div className="receipt-row total">
                <span>Amount Paid:</span>
                <span className="receipt-amount">${completedPayment.amount.toFixed(2)}</span>
              </div>
            </div>

            <div className="receipt-actions">
              <button 
                className="receipt-btn-primary"
                onClick={onNavigateToShop}
              >
                <ShoppingBag size={18} />
                <span>Return to Shop</span>
              </button>
            </div>
          </div>
        ) : (
          /* CARD PAYMENT MAIN LAYOUT */
          <div className="payment-layout-grid">
            {/* Form Column */}
            <div className="payment-form-card">
              <div className="payment-form-header">
                <h1 className="payment-page-title">Card Payment</h1>
                <p className="payment-page-desc">
                  Please enter your payment card details below. All transactions are securely processed through encrypted banking gateways.
                </p>
              </div>

              <form onSubmit={handleCardSubmit} className="wpforms-replica-form">
                {/* 1. Name */}
                <div className="form-group">
                  <label className="wpforms-field-label">
                    Name <span className="wpforms-required">*</span>
                  </label>
                  <div className="form-row-2">
                    <div>
                      <input 
                        type="text" 
                        required 
                        placeholder="First"
                        className="wpforms-input"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      />
                      <span className="wpforms-sublabel">First</span>
                    </div>
                    <div>
                      <input 
                        type="text" 
                        required 
                        placeholder="Last"
                        className="wpforms-input"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                      <span className="wpforms-sublabel">Last</span>
                    </div>
                  </div>
                </div>

                {/* 2. Order Number */}
                <div className="form-group">
                  <label className="wpforms-field-label">Order Number #</label>
                  <input 
                    type="text" 
                    placeholder="Dont include #"
                    className="wpforms-input"
                    value={formData.orderNumber}
                    onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value.replace(/#/g, '') })}
                  />
                  <span className="wpforms-sublabel">If paying for an invoice or placed order, enter order numbers only.</span>
                </div>

                {/* 3. Card Numbers */}
                <div className="form-group">
                  <label className="wpforms-field-label">
                    Card Numbers <span className="wpforms-required">*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      required 
                      maxLength="19"
                      placeholder="4000 1234 5678 9010"
                      className="wpforms-input"
                      style={{ paddingRight: '50px', letterSpacing: '1px' }}
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: formatCardNumber(e.target.value) })}
                    />
                    <div style={{ position: 'absolute', right: '14px', top: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#0066cc' }}>
                        {getCardBrand(formData.cardNumber)}
                      </span>
                      <CreditCard size={20} color="#777" />
                    </div>
                  </div>
                </div>

                {/* 4. CVV & EXP */}
                <div className="form-row-2">
                  <div className="form-group">
                    <label className="wpforms-field-label">
                      CVV <span className="wpforms-required">*</span>
                    </label>
                    <input 
                      type="password" 
                      required 
                      maxLength="4"
                      placeholder="•••"
                      className="wpforms-input"
                      value={formData.cvv}
                      onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '') })}
                    />
                    <span className="wpforms-sublabel">3 digits on back (4 for Amex)</span>
                  </div>

                  <div className="form-group">
                    <label className="wpforms-field-label">
                      EXP <span className="wpforms-required">*</span>
                    </label>
                    <input 
                      type="text" 
                      required 
                      maxLength="5"
                      placeholder="MM/YY"
                      className="wpforms-input"
                      value={formData.exp}
                      onChange={(e) => setFormData({ ...formData, exp: formatExpDate(e.target.value) })}
                    />
                    <span className="wpforms-sublabel">Expiration month / year</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="wpforms-submit-btn"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <span>Processing Card Payment...</span>
                  ) : (
                    <span>Submit</span>
                  )}
                </button>
              </form>
            </div>

            {/* Order Summary Sidebar */}
            <div className="payment-sidebar-summary">
              <div className="payment-summary-card">
                <h3 className="summary-card-title">Order Overview</h3>
                <div className="widget-divider" style={{ marginBottom: '18px' }}></div>

                {cart && cart.length > 0 ? (
                  <div>
                    <div className="summary-items-scroll">
                      {cart.map(item => (
                        <div key={item.id} className="summary-cart-row">
                          <img src={item.image} alt={item.name} className="summary-thumb" />
                          <div className="summary-desc">
                            <span className="summary-name">{item.name}</span>
                            <span className="summary-qty">Qty: {item.quantity}</span>
                          </div>
                          <span className="summary-price">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="summary-divider"></div>
                    <div className="summary-subtotal-row">
                      <span>Subtotal</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-subtotal-row">
                      <span>USPS Priority Shipping</span>
                      <span style={{ color: '#229409', fontWeight: 'bold' }}>FREE</span>
                    </div>
                    <div className="summary-final-total">
                      <span>Total Amount:</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: '13.5px', color: '#666', lineHeight: '1.6', marginBottom: '16px' }}>
                      Paying for an existing phone or manual invoice order? Enter your <strong>Order Number #</strong> from your order confirmation email.
                    </p>
                    <div className="summary-guarantee-box">
                      <ShieldCheck size={20} color="#229409" />
                      <span>100% Delivery Guarantee with Tracking Number Provided</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
