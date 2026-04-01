'use client';
import { CartItem } from '@/types';
import { formatINR } from '@/lib/utils';
import { useCheckout } from '@/context/CheckoutContext';

export default function CartItemRow({ item }: { item: CartItem }) {
  const { updateQty } = useCheckout();
  return (
    <div className="flex gap-3 items-start py-3.5 border-b last:border-b-0" style={{ borderColor: 'var(--gc-border)' }}>
      <div className="w-[58px] h-[58px] rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: 'var(--gc-green-pale)' }}>
        {item.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13.5px] font-medium leading-snug mb-1">{item.name}</div>
        <div className="text-[11.5px] mb-2.5" style={{ color: 'var(--gc-text-3)' }}>{formatINR(item.price)} each</div>
        <div className="flex items-center rounded-lg overflow-hidden w-fit border" style={{ borderColor: 'var(--gc-border)' }}>
          <button onClick={() => updateQty(item.id, -1)} className="w-8 h-7 flex items-center justify-center text-lg transition-colors" style={{ background: 'var(--gc-surface-2)', color: 'var(--gc-text-2)' }}>−</button>
          <div className="w-8 text-center text-[13px] font-medium border-x h-7 flex items-center justify-center" style={{ borderColor: 'var(--gc-border)' }}>{item.qty}</div>
          <button onClick={() => updateQty(item.id, 1)} className="w-8 h-7 flex items-center justify-center text-lg transition-colors" style={{ background: 'var(--gc-surface-2)', color: 'var(--gc-text-2)' }}>+</button>
        </div>
      </div>
      <div className="text-[15px] font-semibold pt-0.5 flex-shrink-0" style={{ color: 'var(--gc-green)' }}>{formatINR(item.price * item.qty)}</div>
    </div>
  );
}
