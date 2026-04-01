'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { CartItem, Address, PaymentData, CheckoutState } from '@/types';
import { generateOrderNumber } from '@/lib/utils';

const DEFAULT_CART: CartItem[] = [
  { id: 1, name: 'Bamboo Toothbrush (Pack of 4)', price: 299, qty: 2, emoji: '🪥' },
  { id: 2, name: 'Reusable Cotton Produce Bags', price: 450, qty: 1, emoji: '🛍️' },
  { id: 3, name: 'Organic Beeswax Wraps (Set of 3)', price: 349, qty: 1, emoji: '🍯' },
];

const DEFAULT_PAYMENT: PaymentData = { cardNumber: '', cardName: '', expiry: '', cvv: '' };
const STORAGE_KEY = 'gc_checkout_v1';

interface CheckoutContextType extends CheckoutState {
  updateQty: (id: number, delta: number) => void;
  addAddress: (addr: Address) => void;
  updateAddress: (index: number, addr: Address) => void;
  removeAddress: (index: number) => void;
  selectAddress: (index: number) => void;
  updatePayment: (field: keyof PaymentData, value: string) => void;
  placeOrder: () => string;
  resetOrder: () => void;
  hydrated: boolean;
}

const CheckoutContext = createContext<CheckoutContextType | null>(null);

function loadState(): CheckoutState {
  if (typeof window === 'undefined') {
    return { cart: DEFAULT_CART, addresses: [], selectedAddressIndex: null, payment: DEFAULT_PAYMENT, orderNumber: null };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error('empty');
    const s = JSON.parse(raw) as Partial<CheckoutState>;
    return {
      cart: s.cart?.length ? s.cart : DEFAULT_CART,
      addresses: s.addresses || [],
      selectedAddressIndex: s.selectedAddressIndex ?? null,
      payment: s.payment || DEFAULT_PAYMENT,
      orderNumber: s.orderNumber || null,
    };
  } catch {
    return { cart: DEFAULT_CART, addresses: [], selectedAddressIndex: null, payment: DEFAULT_PAYMENT, orderNumber: null };
  }
}

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<CheckoutState>({
    cart: DEFAULT_CART, addresses: [], selectedAddressIndex: null, payment: DEFAULT_PAYMENT, orderNumber: null,
  });

  useEffect(() => { setState(loadState()); setHydrated(true); }, []);
  useEffect(() => {
    if (hydrated) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
    }
  }, [state, hydrated]);

  const updateQty = useCallback((id: number, delta: number) => {
    setState(prev => ({ ...prev, cart: prev.cart.map(item => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item) }));
  }, []);

  const addAddress = useCallback((addr: Address) => {
    setState(prev => { const addresses = [...prev.addresses, addr]; return { ...prev, addresses, selectedAddressIndex: addresses.length - 1 }; });
  }, []);

  const updateAddress = useCallback((index: number, addr: Address) => {
    setState(prev => ({ ...prev, addresses: prev.addresses.map((a, i) => i === index ? addr : a) }));
  }, []);

  const removeAddress = useCallback((index: number) => {
    setState(prev => {
      const addresses = prev.addresses.filter((_, i) => i !== index);
      let sel = prev.selectedAddressIndex;
      if (sel === index) sel = addresses.length ? 0 : null;
      else if (sel !== null && sel > index) sel = sel - 1;
      return { ...prev, addresses, selectedAddressIndex: sel };
    });
  }, []);

  const selectAddress = useCallback((index: number) => {
    setState(prev => ({ ...prev, selectedAddressIndex: index }));
  }, []);

  const updatePayment = useCallback((field: keyof PaymentData, value: string) => {
    setState(prev => ({ ...prev, payment: { ...prev.payment, [field]: value } }));
  }, []);

  const placeOrder = useCallback((): string => {
    const num = generateOrderNumber();
    setState(prev => ({ ...prev, orderNumber: num }));
    return num;
  }, []);

  const resetOrder = useCallback(() => {
    setState(prev => ({ cart: DEFAULT_CART, addresses: prev.addresses, selectedAddressIndex: prev.selectedAddressIndex, payment: DEFAULT_PAYMENT, orderNumber: null }));
  }, []);

  return (
    <CheckoutContext.Provider value={{ ...state, hydrated, updateQty, addAddress, updateAddress, removeAddress, selectAddress, updatePayment, placeOrder, resetOrder }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error('useCheckout must be used within CheckoutProvider');
  return ctx;
}
