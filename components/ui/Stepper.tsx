'use client';
const STEPS = ['Cart', 'Shipping', 'Payment', 'Done'];
export default function Stepper({ currentStep }: { currentStep: number }) {
  const pct = currentStep <= 1 ? 0 : currentStep >= 4 ? 100 : ((currentStep - 1) / (STEPS.length - 1)) * 100;
  return (
    <div className="px-5 py-3 border-b" style={{ background: 'var(--gc-surface)', borderColor: 'var(--gc-border)' }}>
      <div className="relative flex items-start justify-between">
        <div className="absolute top-[13px] left-[14px] right-[14px] h-[1.5px]" style={{ background: 'var(--gc-border)', zIndex: 0 }} />
        <div className="absolute top-[13px] left-[14px] h-[1.5px] transition-all duration-500 ease-in-out" style={{ background: 'var(--gc-green)', width: `${pct}%`, zIndex: 1 }} />
        {STEPS.map((label, i) => {
          const n = i + 1;
          const done = n < currentStep;
          const active = n === currentStep;
          return (
            <div key={label} className="flex flex-col items-center gap-[5px]" style={{ zIndex: 2 }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold transition-all duration-300"
                style={done || active ? { background: 'var(--gc-green)', color: '#fff', boxShadow: active ? '0 0 0 4px var(--gc-green-pale)' : 'none' } : { background: 'var(--gc-surface-2)', color: 'var(--gc-text-3)', border: '1.5px solid var(--gc-border)' }}>
                {done ? (<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>) : n}
              </div>
              <span className="text-[10px] font-medium tracking-wider uppercase" style={{ color: done ? 'var(--gc-green-mid)' : active ? 'var(--gc-green)' : 'var(--gc-text-3)' }}>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
