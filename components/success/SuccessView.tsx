'use client';
import { useRouter } from 'next/navigation';
import { useCheckout } from '@/context/CheckoutContext';
import { formatINR, calcTotal, getDeliveryDate } from '@/lib/utils';
import Header from '@/components/ui/Header';

export default function SuccessView() {
  const router = useRouter();
  const { cart, addresses, selectedAddressIndex, orderNumber, resetOrder } = useCheckout();
  const selAddr = selectedAddressIndex !== null ? addresses[selectedAddressIndex] : null;
  const totalItems = cart.reduce((t, i) => t + i.qty, 0);

  function handleContinue() { resetOrder(); router.push('/'); }

  return (
    <>
      <Header />
      <main className="px-4 pt-6 pb-8 step-enter">
        <div className="text-center mb-6">
          <div className="w-[78px] h-[78px] rounded-full flex items-center justify-center mx-auto mb-4 border-[2.5px]"
            style={{ background: 'var(--gc-green-pale)', borderColor: 'var(--gc-green)' }}>
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
              <polyline points="8,20 16,27 30,12" stroke="var(--gc-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="checkmark" />
            </svg>
          </div>
          <h1 className="font-serif text-[28px] font-semibold mb-2" style={{ color: 'var(--gc-green)' }}>Order Placed!</h1>
          <p className="text-[13.5px] leading-relaxed" style={{ color: 'var(--gc-text-2)' }}>
            Thank you for shopping sustainably.<br />Your eco-friendly order is confirmed.
          </p>
        </div>

        <div className="rounded-xl border px-5 py-4 text-center mb-4" style={{ background: 'var(--gc-green-pale)', borderColor: 'var(--gc-green-border)' }}>
          <div className="text-[10px] font-medium uppercase tracking-widest mb-1.5" style={{ color: 'var(--gc-green)' }}>Order Number</div>
          <div className="text-[20px] font-bold tracking-widest" style={{ color: 'var(--gc-green)' }}>{orderNumber || '—'}</div>
        </div>

        <div className="space-y-2.5 mb-4">
          {[
            { icon: '📦', label: 'Expected Delivery', value: getDeliveryDate() },
            ...(selAddr ? [{ icon: '📍', label: 'Delivering to', value: `${selAddr.name}, ${selAddr.city}` }] : []),
            { icon: '🌿', label: 'Eco Impact', value: `~${totalItems} single-use plastic items avoided` },
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 px-4 py-3 rounded-xl border" style={{ background: 'var(--gc-surface)', borderColor: 'var(--gc-border)' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[17px] flex-shrink-0" style={{ background: 'var(--gc-green-pale)' }}>{icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px]" style={{ color: 'var(--gc-text-3)' }}>{label}</div>
                <div className="text-[13.5px] font-medium truncate">{value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border overflow-hidden mb-6" style={{ background: 'var(--gc-surface)', borderColor: 'var(--gc-border)' }}>
          <div className="px-[18px] py-3.5 border-b" style={{ borderColor: 'var(--gc-border)' }}>
            <h3 className="font-serif text-[16px] font-semibold">Order Summary</h3>
          </div>
          <div className="px-[18px] py-3">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center py-2 text-[13px]">
                <span className="flex items-center gap-1.5">{item.emoji} {item.name}</span>
                <span className="font-medium whitespace-nowrap ml-2">×{item.qty} · {formatINR(item.price * item.qty)}</span>
              </div>
            ))}
            <div className="flex justify-between items-center border-t mt-2 pt-3 font-semibold text-[15px]" style={{ borderColor: 'var(--gc-border)' }}>
              <span>Total Paid</span>
              <span style={{ color: 'var(--gc-green)' }}>{formatINR(calcTotal(cart))}</span>
            </div>
          </div>
        </div>

        <button onClick={handleContinue} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-medium text-[14px] transition-all active:scale-[0.98]"
          style={{ background: 'var(--gc-green)' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>
          Continue Shopping
        </button>
      </main>
    </>
  );
}
