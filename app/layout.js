import { Khand, Hind } from 'next/font/google';
import localFont from 'next/font/local';
import clsx from 'clsx';
import '/styles/globals/variables.scss';
import '/styles/globals/defaults.scss';
import '/styles/globals/typography.scss';
import '/styles/globals/icons.scss';

const khand = Khand({
  weight: ['400', '600'],
  subsets: ['latin'],
  variable: '--font-khand',
});

const hind = Hind({
  weight: ['400', '600'],
  subsets: ['latin'],
  variable: '--font-hind',
});

const materialIcons = localFont({
  variable: '--font-material-icons',
  style: 'normal',
  src: '../node_modules/material-symbols/material-symbols-rounded.woff2',
  display: 'block',
  weight: '100 700',
});

export const metadata = {
  title: 'HSP 4x4',
  description: 'HSP',
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en" className={clsx(khand.variable, hind.variable, materialIcons.variable)}>
      <body>{children}</body>
    </html>
  );
}
