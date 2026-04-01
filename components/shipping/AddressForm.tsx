'use client';
import { useState } from 'react';
import { Address, ValidationErrors } from '@/types';
import { validateAddress, INDIAN_STATES } from '@/lib/utils';

const EMPTY: Address = { type: 'home', name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' };

interface Props { initial?: Address; onSave: (addr: Address) => void; onCancel: () => void; isEdit?: boolean; }

export default function AddressForm({ initial, onSave, onCancel, isEdit }: Props) {
  const [form, setForm] = useState<Address>(initial || EMPTY);
  const [errors, setErrors] = useState<ValidationErrors>({});

  function setField(field: keyof Address, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  }

  function handleSave() {
    const errs = validateAddress(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave(form);
  }

  const iStyle = (err: boolean): React.CSSProperties => ({ background: '#fff', color: 'var(--gc-text)', borderColor: err ? 'var(--gc-danger)' : 'var(--gc-border)' });

  return (
    <div className="rounded-xl border p-4 mt-3" style={{ background: 'var(--gc-surface-2)', borderColor: 'var(--gc-border)' }}>
      <div className="text-[14px] font-semibold mb-3.5 flex items-center gap-2">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--gc-green)" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
        {isEdit ? 'Edit Address' : 'Add New Address'}
      </div>
      <div className="flex gap-2 mb-3.5">
        {(['home','work','other'] as Address['type'][]).map(t => (
          <button key={t} onClick={() => setField('type', t)} className="flex-1 py-[7px] px-1 rounded-lg text-xs font-medium capitalize border transition-all"
            style={form.type === t ? { background: 'var(--gc-green-pale)', color: 'var(--gc-green)', borderColor: 'var(--gc-green)' } : { background: '#fff', color: 'var(--gc-text-2)', borderColor: 'var(--gc-border)' }}>
            {t}
          </button>
        ))}
      </div>
      {[
        { label: 'Full Name', field: 'name' as keyof Address, placeholder: 'Your full name' },
        { label: 'Phone', field: 'phone' as keyof Address, placeholder: '10-digit mobile number', maxLen: 10, numeric: true },
        { label: 'Address Line 1', field: 'line1' as keyof Address, placeholder: 'House / Flat / Block No.' },
        { label: 'Address Line 2', field: 'line2' as keyof Address, placeholder: 'Street / Locality / Landmark', optional: true },
      ].map(({ label, field, placeholder, maxLen, numeric, optional }) => (
        <div key={field} className="mb-3">
          <label className="block text-[11px] font-medium uppercase tracking-widest mb-1.5" style={{ color: 'var(--gc-text-2)' }}>
            {label}{optional && <span className="ml-1 normal-case text-[10px]" style={{ color: 'var(--gc-text-3)' }}>(optional)</span>}
          </label>
          <input className="w-full px-3 py-2.5 rounded-lg text-[13.5px] border" placeholder={placeholder}
            value={form[field] as string} maxLength={maxLen} inputMode={numeric ? 'numeric' : undefined}
            onChange={e => setField(field, numeric ? e.target.value.replace(/\D/g,'') : e.target.value)}
            style={iStyle(!!errors[field])} />
          {errors[field] && <p className="text-[10.5px] mt-1" style={{ color: 'var(--gc-danger)' }}>{errors[field]}</p>}
        </div>
      ))}
      <div className="grid grid-cols-2 gap-3">
        <div className="mb-3">
          <label className="block text-[11px] font-medium uppercase tracking-widest mb-1.5" style={{ color: 'var(--gc-text-2)' }}>City</label>
          <input className="w-full px-3 py-2.5 rounded-lg text-[13.5px] border" placeholder="City" value={form.city}
            onChange={e => setField('city', e.target.value)} style={iStyle(!!errors.city)} />
          {errors.city && <p className="text-[10.5px] mt-1" style={{ color: 'var(--gc-danger)' }}>{errors.city}</p>}
        </div>
        <div className="mb-3">
          <label className="block text-[11px] font-medium uppercase tracking-widest mb-1.5" style={{ color: 'var(--gc-text-2)' }}>Pincode</label>
          <input className="w-full px-3 py-2.5 rounded-lg text-[13.5px] border" placeholder="6 digits" value={form.pincode}
            maxLength={6} inputMode="numeric" onChange={e => setField('pincode', e.target.value.replace(/\D/g,''))} style={iStyle(!!errors.pincode)} />
          {errors.pincode && <p className="text-[10.5px] mt-1" style={{ color: 'var(--gc-danger)' }}>{errors.pincode}</p>}
        </div>
      </div>
      <div className="mb-3">
        <label className="block text-[11px] font-medium uppercase tracking-widest mb-1.5" style={{ color: 'var(--gc-text-2)' }}>State</label>
        <select className="w-full px-3 py-2.5 rounded-lg text-[13.5px] border" value={form.state}
          onChange={e => setField('state', e.target.value)} style={iStyle(!!errors.state)}>
          <option value="">Select state</option>
          {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {errors.state && <p className="text-[10.5px] mt-1" style={{ color: 'var(--gc-danger)' }}>{errors.state}</p>}
      </div>
      <div className="flex gap-2.5 mt-1">
        <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl text-[13px] font-medium text-white" style={{ background: 'var(--gc-green)' }}>
          {isEdit ? 'Update Address' : 'Save Address'}
        </button>
        <button onClick={onCancel} className="px-4 py-2.5 rounded-xl text-[13px] font-medium border"
          style={{ background: '#fff', color: 'var(--gc-text-2)', borderColor: 'var(--gc-border)' }}>Cancel</button>
      </div>
    </div>
  );
}
