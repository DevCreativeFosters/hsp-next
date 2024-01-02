'use client';

import { useState, useCallback } from 'react';
import parse from 'html-react-parser';
import clsx from 'clsx';

import Button from '@components/button/button';

import styles from './tooltip.module.scss';

export default function Tile({ title, content, className }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className={clsx(styles.tooltipContainer, className)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {title && <div className={styles.title}>{title}</div>}
      <Button
        className={styles.tooltipButton}
        rightIcon="info"
        variant="tertiary"
        onClick={() => setShowTooltip(!showTooltip)}
      />
      {showTooltip && <div className={styles.tooltip}>{parse(content)}</div>}
    </div>
  );
}
