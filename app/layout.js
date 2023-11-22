import localFont from 'next/font/local';
import clsx from 'clsx';
import LayoutClient from './layout-client';
import '@styles/main.scss';

const hind = localFont({
  variable: '--font-hind',
  subsets: ['latin'],
  style: 'normal',
  src: [
    {
      path: '../assets/fonts/Hind-400-Regular.woff2',
      weight: '400',
    },
    {
      path: '../assets/fonts/Hind-600-SemiBold.woff2',
      weight: '600',
    },
  ],
  display: 'block',
  weight: '400 600',
});

const khand = localFont({
  variable: '--font-khand',
  subsets: ['latin'],
  style: 'normal',
  src: [
    {
      path: '../assets/fonts/Khand-400-Regular.woff2',
      weight: '400',
    },
    {
      path: '../assets/fonts/Khand-600-SemiBold.woff2',
      weight: '600',
    },
  ],
  display: 'block',
  weight: '400 600',
});

export const metadata = {
  title: 'HSP 4x4',
  description: 'HSP',
};

export const revalidate = 30;

export default async function RootLayout({ children }) {
  return (
    <html lang="en" className={clsx(hind.variable, khand.variable)}>
      <body className="" data-rh="class">
        {children}
        <LayoutClient />
      </body>
    </html>
  );
}
