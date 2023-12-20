'use client';

import { useState } from 'react';
import clsx from 'clsx';
import parse from 'html-react-parser';
import Button from '@components/button/button';
import styles from './tooltip.module.scss';

export default function Tooltip({ attributes = {}, className }) {
  const [isVisible, setIsVisible] = useState();

  if (!attributes.content) {
    return null;
  }

  return (
    <div
      className={clsx(styles.tooltipContainer, className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {attributes.title && (
        <div className={styles.title}>{attributes.title}</div>
      )}
      <Button
        className={styles.tooltipButton}
        rightIcon="question-mark"
        variant="tertiary"
        onClick={() => setIsVisible(!isVisible)}
      />
      {isVisible && (
        <div className={styles.tooltip}>{parse(attributes.content)}</div>
      )}
    </div>
  );
}
