import { CartItem } from '@/types';
import { formatINR, calcSubtotal, SHIPPING_FEE, calcTotal } from '@/lib/utils';

export default function OrderSummary({ cart }: { cart: CartItem[] }) {
  return (
    <div className="rounded-2xl border overflow-hidden mb-3.5" style={{ background: 'var(--gc-surface)', borderColor: 'var(--gc-border)' }}>
      <div className="px-[18px] py-3.5 border-b" style={{ borderColor: 'var(--gc-border)' }}>
        <h2 className="font-serif text-[18px] font-semibold">Order Summary</h2>
      </div>
      <div className="px-[18px] py-3.5">
        {[['Subtotal', formatINR(calcSubtotal(cart))], ['Shipping', formatINR(SHIPPING_FEE)]].map(([l, v]) => (
          <div key={l} className="flex justify-between py-[7px] text-[13.5px]">
            <span style={{ color: 'var(--gc-text-2)' }}>{l}</span>
            <span className="font-medium">{v}</span>
          </div>
        ))}
        <div className="flex justify-between items-center border-t mt-1.5 pt-3.5 font-semibold text-[15px]" style={{ borderColor: 'var(--gc-border)' }}>
          <span>Total</span>
          <span className="text-[17px]" style={{ color: 'var(--gc-green)' }}>{formatINR(calcTotal(cart))}</span>
        </div>
        <div className="mt-3.5 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11.5px] font-medium border"
            style={{ background: 'var(--gc-green-pale)', color: 'var(--gc-green)', borderColor: 'var(--gc-green-border)' }}>
            🌿 Sustainably sourced · Eco-certified
          </span>
        </div>
      </div>
    </div>
  );
}
