import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CheckoutProvider } from '@/context/CheckoutContext';

export const metadata: Metadata = {
  title: 'Ecoyaan — Eco Checkout',
  description: 'Sustainable eco-friendly products delivered to your door',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CheckoutProvider>
          <div className="min-h-screen bg-[var(--gc-bg)] sm:py-6 sm:flex sm:justify-center">
            <div className="w-full sm:max-w-[480px] sm:rounded-3xl sm:shadow-2xl sm:overflow-hidden relative bg-[var(--gc-bg)]">
              {children}
            </div>
          </div>
        </CheckoutProvider>
      </body>
    </html>
  );
}
