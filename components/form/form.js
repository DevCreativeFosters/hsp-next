'use client';

import clsx from 'clsx';
import styles from './form.module.scss';

export default function Form({
  withPadding = false,
  withBackground = false,
  children,
  ...props
}) {
  return (
    <form
      className={clsx(styles.form, {
        [styles.withPadding]: withPadding,
        [styles.withBackground]: withBackground,
      })}
      {...props}
    >
      {children}
    </form>
  );
}
