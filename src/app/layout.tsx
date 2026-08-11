import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'ZAPASNO — готовність на 72 години', description: 'Спокійна персональна оцінка готовності до наступних 72 годин.' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="uk"><body>{children}</body></html>;
}
