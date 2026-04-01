'use client';
import { Address } from '@/types';

const TAG: Record<Address['type'], React.CSSProperties> = {
  home:  { background: '#DBEAFE', color: '#1D4ED8' },
  work:  { background: '#FEF3C7', color: '#92400E' },
  other: { background: '#F3E8FF', color: '#6D28D9' },
};

interface Props {
  address: Address;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onRemove: () => void;
}

export default function AddressCard({ address, selected, onSelect, onEdit, onRemove }: Props) {
  return (
    <div className="rounded-xl border-[1.5px] p-3.5 mb-2.5 cursor-pointer transition-all duration-200"
      style={{ borderColor: selected ? 'var(--gc-green)' : 'var(--gc-border)', background: selected ? 'var(--gc-green-pale)' : 'var(--gc-surface)' }}
      onClick={onSelect}>
      <div className="flex items-start gap-2.5">
        <div className="w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200"
          style={{ borderColor: selected ? 'var(--gc-green)' : 'var(--gc-border)', background: selected ? 'var(--gc-green)' : 'transparent' }}>
          {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-1 mb-1">
            <span className="text-[13.5px] font-medium">{address.name}</span>
            <span className="text-[10.5px] font-medium px-2 py-[2px] rounded-full capitalize" style={TAG[address.type]}>{address.type}</span>
          </div>
          <div className="text-[12.5px] leading-relaxed" style={{ color: 'var(--gc-text-2)' }}>
            {address.line1}{address.line2 ? `, ${address.line2}` : ''}<br />
            {address.city}, {address.state} – {address.pincode}<br />
            📱 {address.phone}
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-2.5 pl-7">
        <button onClick={e => { e.stopPropagation(); onEdit(); }} className="text-[11.5px] px-2.5 py-1 rounded-md border"
          style={{ borderColor: 'var(--gc-border)', color: 'var(--gc-text-2)', background: '#fff' }}>Edit</button>
        <button onClick={e => { e.stopPropagation(); onRemove(); }} className="text-[11.5px] px-2.5 py-1 rounded-md border"
          style={{ borderColor: 'var(--gc-border)', color: 'var(--gc-text-2)', background: '#fff' }}>Remove</button>
      </div>
    </div>
  );
}
