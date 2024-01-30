'use client';

import { useMemo } from 'react';
import clsx from 'clsx';
import { replaceShortcodes } from '@lib/replace-shortcodes';
import DownloadLinkWrapper from '@components/download-link-wrapper/download-link-wrapper';
import styles from './wysiwyg.module.scss';

export default function Wysiwyg({ className, content }) {
  const parsedContent = useMemo(() => replaceShortcodes(content), [content]);

  return (
    <DownloadLinkWrapper>
      <div className={clsx(styles.wysiwyg, className)}>{parsedContent}</div>
    </DownloadLinkWrapper>
  );
}
