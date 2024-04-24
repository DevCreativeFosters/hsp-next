'use client';

import { useCallback, useEffect, useState } from 'react';

import { createPortal } from 'react-dom';

import clsx from 'clsx';

import Button from '@components/button/button';

import styles from './modal.module.scss';

export const MODAL_PORTAL_ID = 'modal-portal';

export default function Modal({
  children,
  container: customContainer,
  darkBackdrop = false,
  isVisible,
  maxWidth,
  onClose = () => {},
  title,
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
    <div
      className={clsx(styles.backdrop, {
        [styles.darkBackdrop]: darkBackdrop,
      })}
    >
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
            onClick={onCloseButtonClick}
            rightIcon="arrow-backward-large"
            variant="tertiary"
          />
          {title && <h3>{title}</h3>}
          <Button
            className={styles.closeButton}
            onClick={onCloseButtonClick}
            rightIcon="close-large"
            variant="tertiary"
          />
        </header>
        <div className={styles.content}>{children}</div>
      </div>
    </div>,
    container,
  );
}
