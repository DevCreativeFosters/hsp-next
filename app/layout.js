import localFont from 'next/font/local';
import NextTopLoader from 'nextjs-toploader';
import clsx from 'clsx';
import { getGlobalOptions } from '@lib/api';
import RootLayoutClient from './layout-client';
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
  const globalOptions = await getGlobalOptions();
  const downloadFileFormId = globalOptions?.downloadFileFormId;
  return (
    <html
      lang="en"
      className={clsx(hind.variable, khand.variable)}
      data-download-file-form-id={downloadFileFormId}
    >
      <body className="" data-rh="class">
        <NextTopLoader color="#ed2935ff" />
        {children}
        <RootLayoutClient />
      </body>
    </html>
  );
}
