'use client';

import Header from '/components/header/header';
import Footer from '/components/footer/footer';
import { useCallback, useRef } from 'react';

export default function LayoutClient({ children }) {
  const onClick = useCallback(() => {
    document.dispatchEvent(new CustomEvent('onNonHeaderClick'));
  }, []);

  return (
    <>
      <Header />
      <main onClick={onClick}>{children}</main>
      <Footer onClick={onClick} />
    </>
  );
}
