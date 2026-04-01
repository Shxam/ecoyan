'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Address } from '@/types';
import { useCheckout } from '@/context/CheckoutContext';
import { formatINR, calcSubtotal, calcTotal, SHIPPING_FEE } from '@/lib/utils';
import AddressCard from './AddressCard';
import AddressForm from './AddressForm';
import Header from '@/components/ui/Header';
import Stepper from '@/components/ui/Stepper';
import StickyFooter from '@/components/ui/StickyFooter';

type FormMode = 'none' | 'add' | { editIndex: number };

export default function ShippingForm() {
  const router = useRouter();
  const { cart, addresses, selectedAddressIndex, addAddress, updateAddress, removeAddress, selectAddress } = useCheckout();
  const [formMode, setFormMode] = useState<FormMode>('none');
  const [toast, setToast] = useState('');
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formMode !== 'none') setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }, [formMode]);

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 2200); }

  function handleSave(addr: Address) {
    if (formMode === 'add') { addAddress(addr); showToast('Address saved ✓'); }
    else if (typeof formMode === 'object') { updateAddress(formMode.editIndex, addr); showToast('Address updated ✓'); }
    setFormMode('none');
  }

  function handleNext() {
    if (formMode !== 'none') { showToast('Save or cancel the address form first'); return; }
    if (selectedAddressIndex === null || !addresses.length) { showToast('Please add or select a delivery address'); return; }
    router.push('/checkout/payment');
  }

  return (
    <>
      <Header />
      <Stepper currentStep={2} />
      <main className="px-4 pt-4 pb-[90px] step-enter">
        {addresses.length === 0 && formMode === 'none' && (
          <div className="rounded-2xl border border-dashed p-6 text-center mb-3.5" style={{ background: 'var(--gc-surface-2)', borderColor: 'var(--gc-border-2)' }}>
            <div className="text-[32px] mb-2.5">📍</div>
            <h3 className="font-serif text-[18px] font-semibold mb-1.5">No addresses yet</h3>
            <p className="text-[13px]" style={{ color: 'var(--gc-text-2)' }}>Add a delivery address to continue</p>
          </div>
        )}
        {addresses.length > 0 && (
          <>
            <h2 className="font-serif text-[20px] font-semibold mb-3.5">Delivery Address</h2>
            {addresses.map((addr, i) => (
              <AddressCard key={i} address={addr} selected={selectedAddressIndex === i}
                onSelect={() => selectAddress(i)} onEdit={() => setFormMode({ editIndex: i })}
                onRemove={() => { removeAddress(i); showToast('Address removed'); }} />
            ))}
          </>
        )}
        <div ref={formRef}>
          {formMode !== 'none' && (
            <AddressForm initial={typeof formMode === 'object' ? addresses[formMode.editIndex] : undefined}
              isEdit={typeof formMode === 'object'} onSave={handleSave} onCancel={() => setFormMode('none')} />
          )}
        </div>
        {formMode === 'none' && (
          <button onClick={() => setFormMode('add')} className="w-full py-3.5 border-[1.5px] border-dashed rounded-xl flex items-center justify-center gap-2 text-[13.5px] font-medium transition-all duration-200 mt-0.5"
            style={{ borderColor: 'var(--gc-border)', color: 'var(--gc-green)', background: 'transparent' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add New Address
          </button>
        )}
        <div className="rounded-2xl border overflow-hidden mt-3.5" style={{ background: 'var(--gc-surface)', borderColor: 'var(--gc-border)' }}>
          <div className="px-4 py-3">
            {[['Items subtotal', formatINR(calcSubtotal(cart))], ['Shipping', formatINR(SHIPPING_FEE)]].map(([l,v]) => (
              <div key={l} className="flex justify-between text-[13.5px] py-1.5">
                <span style={{ color: 'var(--gc-text-2)' }}>{l}</span><span className="font-medium">{v}</span>
              </div>
            ))}
            <div className="flex justify-between items-center border-t mt-1 pt-3 font-semibold text-[15px]" style={{ borderColor: 'var(--gc-border)' }}>
              <span>Order Total</span><span style={{ color: 'var(--gc-green)' }}>{formatINR(calcTotal(cart))}</span>
            </div>
          </div>
        </div>
      </main>
      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full text-white text-[12.5px] z-[300] whitespace-nowrap" style={{ background: '#1A1A1A' }}>
          {toast}
        </div>
      )}
      <StickyFooter nextLabel="Continue to Payment" onNext={handleNext} backLabel="Back" onBack={() => router.push('/')} />
    </>
  );
}
