import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Jadwal Supervisi Guru KBM - SMP Negeri 7 Sentani',
  description: 'Aplikasi Manajemen Jadwal Supervisi Pembelajaran & Administrasi Guru SMP Negeri 7 Sentani',
  openGraph: {
    title: 'Jadwal Supervisi Guru KBM - SMP Negeri 7 Sentani',
    description: 'Aplikasi Manajemen Jadwal Supervisi Pembelajaran & Administrasi Guru SMP Negeri 7 Sentani',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jadwal Supervisi Guru KBM - SMP Negeri 7 Sentani',
    description: 'Aplikasi Manajemen Jadwal Supervisi Pembelajaran & Administrasi Guru SMP Negeri 7 Sentani',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-slate-50 min-h-screen text-slate-800 font-['Plus_Jakarta_Sans',sans-serif] antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
