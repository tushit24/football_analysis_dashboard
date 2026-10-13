import type { Metadata } from 'next';
import './globals.css';
import { SideNav } from '@/components/SideNav';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { ThemeListener } from '@/components/ThemeListener';

export const metadata: Metadata = {
  title: 'Football Prediction Platform | Manager Decision Support System',
  description:
    'Premier League tactical decision-support and recruitment platform. Strategy brief builder, player compatibility engine, and match/season predictors.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-bg text-tx antialiased selection:bg-pitch selection:text-slate-950">
        <ThemeListener />
        <div className="flex min-h-screen">
          {/* Desktop Left Sidebar */}
          <SideNav />

          {/* Main Workspace Area */}
          <main className="flex-1 min-w-0 relative pb-20 lg:pb-12">
            <div className="glow-aura" />
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
              {children}
            </div>
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </body>
    </html>
  );
}
