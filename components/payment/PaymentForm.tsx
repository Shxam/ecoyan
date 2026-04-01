'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckout } from '@/context/CheckoutContext';
import { validatePayment, maskCardNumber, maskExpiry, formatINR, calcSubtotal, calcTotal, SHIPPING_FEE } from '@/lib/utils';
import { ValidationErrors } from '@/types';
import Header from '@/components/ui/Header';
import Stepper from '@/components/ui/Stepper';
import StickyFooter from '@/components/ui/StickyFooter';

export default function PaymentForm() {
  const router = useRouter();
  const { cart, payment, addresses, selectedAddressIndex, updatePayment, placeOrder } = useCheckout();
  const [errors, setErrors] = useState<ValidationErrors>({});
  const selAddr = selectedAddressIndex !== null ? addresses[selectedAddressIndex] : null;

  function handleNext() {
    const errs = validatePayment(payment);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    placeOrder();
    router.push('/checkout/success');
  }

  function setField(field: Parameters<typeof updatePayment>[0], rawValue: string) {
    let value = rawValue;
    if (field === 'cardNumber') value = maskCardNumber(rawValue);
    if (field === 'expiry') value = maskExpiry(rawValue);
    updatePayment(field, value);
    setErrors(prev => ({ ...prev, [field]: '' }));
  }

  const iStyle = (err: boolean): React.CSSProperties => ({ background: '#fff', color: 'var(--gc-text)', borderColor: err ? 'var(--gc-danger)' : 'var(--gc-border)' });
  const dispNum = payment.cardNumber || '•••• •••• •••• ••••';
  const dispName = payment.cardName || 'YOUR NAME';
  const dispExp = payment.expiry || 'MM/YY';

  return (
    <>
      <Header />
      <Stepper currentStep={3} />
      <main className="px-4 pt-4 pb-[90px] step-enter">
        {/* Live card visual */}
        <div className="rounded-2xl p-5 text-white mb-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#1B5E3B 0%,#2D8A5E 100%)', minHeight: '140px' }}>
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <div className="absolute -bottom-16 right-5 w-52 h-52 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
          <div className="absolute top-4 right-5 text-[11px] opacity-50 font-medium tracking-wider">ECOYAAN</div>
          <div className="w-8 h-6 rounded-[4px] mb-4" style={{ background: 'rgba(255,255,255,0.22)' }} />
          <div className="text-[15px] tracking-[0.18em] font-light mb-4">{dispNum}</div>
          <div className="flex justify-between items-end">
            <div><div className="text-[9px] opacity-60 uppercase tracking-wider mb-0.5">Card Holder</div><div className="text-[12.5px] font-medium uppercase">{dispName}</div></div>
            <div className="text-right"><div className="text-[9px] opacity-60 uppercase tracking-wider mb-0.5">Expires</div><div className="text-[12.5px] font-medium">{dispExp}</div></div>
          </div>
        </div>

        {/* Card form */}
        <div className="rounded-2xl border overflow-hidden mb-3.5" style={{ background: 'var(--gc-surface)', borderColor: 'var(--gc-border)' }}>
          <div className="px-[18px] py-3.5 border-b" style={{ borderColor: 'var(--gc-border)' }}>
            <h2 className="font-serif text-[18px] font-semibold">Card Details</h2>
          </div>
          <div className="px-[18px] py-4">
            {[
              { label: 'Card Number', field: 'cardNumber' as const, placeholder: '1234 5678 9012 3456', maxLen: 19, numeric: true },
              { label: 'Name on Card', field: 'cardName' as const, placeholder: 'As printed on card' },
            ].map(({ label, field, placeholder, maxLen, numeric }) => (
              <div key={field} className="mb-3">
                <label className="block text-[11px] font-medium uppercase tracking-widest mb-1.5" style={{ color: 'var(--gc-text-2)' }}>{label}</label>
                <input className="w-full px-3 py-2.5 rounded-lg text-[13.5px] border" placeholder={placeholder}
                  value={payment[field]} maxLength={maxLen} inputMode={numeric ? 'numeric' : undefined}
                  onChange={e => setField(field, e.target.value)} style={iStyle(!!errors[field])} />
                {errors[field] && <p className="text-[10.5px] mt-1" style={{ color: 'var(--gc-danger)' }}>{errors[field]}</p>}
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <div className="mb-3">
                <label className="block text-[11px] font-medium uppercase tracking-widest mb-1.5" style={{ color: 'var(--gc-text-2)' }}>Expiry</label>
                <input className="w-full px-3 py-2.5 rounded-lg text-[13.5px] border" placeholder="MM/YY"
                  value={payment.expiry} maxLength={5} inputMode="numeric"
                  onChange={e => { const m = maskExpiry(e.target.value); setField('expiry', m); e.target.value = m; }}
                  style={iStyle(!!errors.expiry)} />
                {errors.expiry && <p className="text-[10.5px] mt-1" style={{ color: 'var(--gc-danger)' }}>{errors.expiry}</p>}
              </div>
              <div className="mb-3">
                <label className="block text-[11px] font-medium uppercase tracking-widest mb-1.5" style={{ color: 'var(--gc-text-2)' }}>CVV</label>
                <input className="w-full px-3 py-2.5 rounded-lg text-[13.5px] border" placeholder="•••"
                  value={payment.cvv} maxLength={3} type="password" inputMode="numeric"
                  onChange={e => setField('cvv', e.target.value.replace(/\D/g, ''))} style={iStyle(!!errors.cvv)} />
                {errors.cvv && <p className="text-[10.5px] mt-1" style={{ color: 'var(--gc-danger)' }}>{errors.cvv}</p>}
              </div>
            </div>
          </div>
        </div>

        {selAddr && (
          <div className="rounded-2xl border overflow-hidden mb-3.5" style={{ background: 'var(--gc-surface)', borderColor: 'var(--gc-border)' }}>
            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--gc-border)' }}>
              <h3 className="font-semibold text-[15px]">Delivering to</h3>
              <button onClick={() => router.push('/checkout/shipping')} className="text-[12px] font-medium" style={{ color: 'var(--gc-green)' }}>Change</button>
            </div>
            <div className="px-4 py-3">
              <div className="font-medium text-[13.5px] mb-1">{selAddr.name}</div>
              <div className="text-[12.5px] leading-relaxed" style={{ color: 'var(--gc-text-2)' }}>
                {selAddr.line1}{selAddr.line2 ? `, ${selAddr.line2}` : ''}, {selAddr.city}, {selAddr.state} – {selAddr.pincode}
              </div>
            </div>
          </div>
        )}

        <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--gc-surface)', borderColor: 'var(--gc-border)' }}>
          <div className="px-4 py-3">
            {[['Subtotal', formatINR(calcSubtotal(cart))], ['Shipping', formatINR(SHIPPING_FEE)]].map(([l,v]) => (
              <div key={l} className="flex justify-between text-[13.5px] py-1.5">
                <span style={{ color: 'var(--gc-text-2)' }}>{l}</span><span className="font-medium">{v}</span>
              </div>
            ))}
            <div className="flex justify-between items-center border-t mt-1 pt-3 font-semibold text-[15px]" style={{ borderColor: 'var(--gc-border)' }}>
              <span>Amount to Pay</span><span style={{ color: 'var(--gc-green)' }}>{formatINR(calcTotal(cart))}</span>
            </div>
          </div>
        </div>
        <div className="text-center mt-4 pb-1">
          <span className="text-[11.5px]" style={{ color: 'var(--gc-text-3)' }}>🔒 Secured with 256-bit SSL encryption</span>
        </div>
      </main>
      <StickyFooter nextLabel="Place Order" onNext={handleNext} backLabel="Back" onBack={() => router.push('/checkout/shipping')}
        nextIcon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>} />
    </>
  );
}
