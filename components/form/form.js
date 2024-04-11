'use client';

import clsx from 'clsx';

import styles from './form.module.scss';

export default function Form({
  children,
  isDirty = false,
  withBackground = false,
  withPadding = false,
  ...props
}) {
  return (
    <form
      className={clsx(styles.form, {
        [styles.withPadding]: withPadding,
        [styles.withBackground]: withBackground,
        'is-dirty': isDirty,
      })}
      {...props}
    >
      {children}
    </form>
  );
}
