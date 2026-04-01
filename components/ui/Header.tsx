'use client';
export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-5 h-[60px] border-b" style={{ background: 'var(--gc-surface)', borderColor: 'var(--gc-border)' }}>
      <div className="font-serif text-[22px] font-semibold flex items-center gap-2" style={{ color: 'var(--gc-green)' }}>
        <div className="w-[30px] h-[30px] rounded-lg flex items-center justify-center text-[14px]" style={{ background: 'var(--gc-green-pale)' }}>🌿</div>
        Ecoyaan
      </div>
      <div className="flex items-center gap-1.5" style={{ color: 'var(--gc-text-3)' }}>
        <div className="w-[6px] h-[6px] rounded-full bg-green-500" />
        <span className="text-[11px]">Secure Checkout</span>
      </div>
    </header>
  );
}
