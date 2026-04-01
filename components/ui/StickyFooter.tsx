'use client';
import { ReactNode } from 'react';
interface StickyFooterProps {
  onNext: () => void;
  onBack?: () => void;
  nextLabel: string;
  backLabel?: string;
  nextIcon?: ReactNode;
}
export default function StickyFooter({ onNext, onBack, nextLabel, backLabel, nextIcon }: StickyFooterProps) {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full sm:max-w-[480px] z-[200] px-4 py-3 border-t"
      style={{ background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderColor: 'var(--gc-border)' }}>
      <div className="flex gap-2.5 items-center">
        {backLabel && onBack && (
          <button onClick={onBack} className="flex items-center gap-1.5 px-4 py-[11px] rounded-xl text-sm font-medium transition-all duration-200 border"
            style={{ background: 'var(--gc-surface-2)', color: 'var(--gc-text-2)', borderColor: 'var(--gc-border)', minWidth: '80px' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
            {backLabel}
          </button>
        )}
        <button onClick={onNext} className="flex-1 flex items-center justify-center gap-2 py-[11px] rounded-xl text-sm font-medium text-white transition-all duration-200 active:scale-[0.98]"
          style={{ background: 'var(--gc-green)' }}>
          {nextLabel}
          {nextIcon || (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>)}
        </button>
      </div>
    </div>
  );
}
