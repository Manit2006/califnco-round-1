import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Califnco Water Ecosystem | Admin Console',
  description: 'Enterprise administration panel for Califnco water purifiers, dealer approvals, orders, and field services.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
