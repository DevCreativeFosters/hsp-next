'use client';

import clsx from 'clsx';

import styles from './form.module.scss';

export default function Form({
  children,
  isDirty = false,
  scrollRef,
  withBackground = false,
  withCustomStyle01 = false,
  withPadding = false,
  ...props
}) {
  return (
    <form
      className={clsx(styles.form, {
        [styles.withCustomStyle01]: withCustomStyle01,
        [styles.withPadding]: withPadding,
        [styles.withBackground]: withBackground,
        'is-dirty': isDirty,
      })}
      {...props}
      ref={scrollRef}
    >
      {children}
    </form>
  );
}
