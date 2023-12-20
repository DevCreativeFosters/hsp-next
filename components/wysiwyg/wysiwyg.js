import { useMemo } from 'react';
import clsx from 'clsx';
import { replaceShortcodes } from '@lib/replace-shortcodes';
import styles from './wysiwyg.module.scss';

export default function Wysiwyg({ className, content }) {
  const parsedContent = useMemo(() => replaceShortcodes(content), [content]);

  return <div className={clsx(styles.wysiwyg, className)}>{parsedContent}</div>;
}
