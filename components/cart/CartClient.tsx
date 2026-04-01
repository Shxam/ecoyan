'use client';
import { useRouter } from 'next/navigation';
import { CartData } from '@/types';
import { useCheckout } from '@/context/CheckoutContext';
import CartItemRow from './CartItemRow';
import OrderSummary from './OrderSummary';
import Header from '@/components/ui/Header';
import Stepper from '@/components/ui/Stepper';
import StickyFooter from '@/components/ui/StickyFooter';

export default function CartClient({ initialData }: { initialData: CartData }) {
  const router = useRouter();
  const { cart, hydrated } = useCheckout();
  const displayCart = hydrated ? cart : initialData.cartItems;
  return (
    <>
      <Header />
      <Stepper currentStep={1} />
      <main className="px-4 pt-4 pb-[90px] step-enter">
        <div className="rounded-2xl border overflow-hidden mb-3.5" style={{ background: 'var(--gc-surface)', borderColor: 'var(--gc-border)' }}>
          <div className="px-[18px] py-3.5 border-b flex items-center justify-between" style={{ borderColor: 'var(--gc-border)' }}>
            <h2 className="font-serif text-[18px] font-semibold">Your Cart</h2>
            <span className="text-[12.5px]" style={{ color: 'var(--gc-text-3)' }}>{displayCart.reduce((t, i) => t + i.qty, 0)} items</span>
          </div>
          <div className="px-[18px]">
            {displayCart.map(item => <CartItemRow key={item.id} item={item} />)}
          </div>
        </div>
        <OrderSummary cart={displayCart} />
      </main>
      <StickyFooter nextLabel="Proceed to Shipping" onNext={() => router.push('/checkout/shipping')} />
    </>
  );
}
