import clsx from 'clsx';
import { ReCaptchaProvider } from 'next-recaptcha-v3';
import localFont from 'next/font/local';
import NextTopLoader from 'nextjs-toploader';

import { getGlobalOptions } from '@lib/api/get-global-options';

import PreviewAlert from '@components/preview-alert/preview-alert';

import '@styles/main.scss';

import RootLayoutClient from './layout-client';

const hind = localFont({
  display: 'block',
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
  style: 'normal',
  subsets: ['latin'],
  variable: '--font-hind',
  weight: '400 600',
});

const khand = localFont({
  display: 'block',
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
  style: 'normal',
  subsets: ['latin'],
  variable: '--font-khand',
  weight: '400 600',
});

export const metadata = {
  description: 'HSP',
  title: 'HSP 4x4',
};

export const revalidate = 30;

export default async function RootLayout({ children }) {
  const globalOptions = await getGlobalOptions();
  const downloadFileFormId = globalOptions?.downloadFileFormId;
  return (
    <html
      className={clsx(hind.variable, khand.variable)}
      data-download-file-form-id={downloadFileFormId}
      lang="en-au"
    >
      <body className="" data-rh="class">
        <ReCaptchaProvider useEnterprise>
          <NextTopLoader color="#ed2935ff" />
          {children}
          <PreviewAlert />
          <RootLayoutClient />
        </ReCaptchaProvider>
      </body>
    </html>
  );
}
