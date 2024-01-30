'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Button from '@components/button/button';
import styles from './modal.module.scss';

export const MODAL_PORTAL_ID = 'modal-portal';

export default function Modal({
  title,
  isVisible,
  maxWidth,
  container: customContainer,
  children,
  onClose = () => {},
}) {
  const [doc, setDoc] = useState(null);

  useEffect(function onInit() {
    setDoc(document);
  }, []);

  const container = customContainer || doc?.getElementById(MODAL_PORTAL_ID);

  const maxWidthNormalized =
    typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;

  const onCloseButtonClick = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!container || !isVisible) {
    return null;
  }

  return createPortal(
    <div className={styles.backdrop}>
      <div
        className={styles.modal}
        style={
          maxWidthNormalized
            ? {
                '--max-width': maxWidthNormalized,
              }
            : null
        }
      >
        <header className={styles.header}>
          <Button
            className={styles.backwardButton}
            variant="tertiary"
            rightIcon="arrow-backward-large"
            onClick={onCloseButtonClick}
          />
          {title && <h3>{title}</h3>}
          <Button
            className={styles.closeButton}
            rightIcon="close-large"
            variant="tertiary"
            onClick={onCloseButtonClick}
          />
        </header>
        <div className={styles.content}>{children}</div>
      </div>
    </div>,
    container,
  );
}
