import CartClient from '@/components/cart/CartClient';
import { CartData } from '@/types';

export const dynamic = 'force-dynamic';

const cartData: CartData = {
  cartItems: [
    { id: 1, name: 'Bamboo Toothbrush (Pack of 4)', price: 299, qty: 2, emoji: '🪥' },
    { id: 2, name: 'Reusable Cotton Produce Bags', price: 450, qty: 1, emoji: '🛍️' },
    { id: 3, name: 'Organic Beeswax Wraps (Set of 3)', price: 349, qty: 1, emoji: '🍯' },
  ],
  shipping_fee: 50,
};

export default async function HomePage() {
  return <CartClient initialData={cartData} />;
}
