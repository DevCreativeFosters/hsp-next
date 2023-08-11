'use client';

import { useState } from 'react';
import clsx from 'clsx';
import styles from '@styles/forms/input.module.scss';

export default function Input({
  size = 'small',
  background = 'dark',
  errorMessage = '',
  placeholder = '',
  label = '',
  ...props
}) {
  // Internal values are used for demos purposes to make component work with basic props
  // If would you like to use it along with other components please pass `onChange` and `value` props
  const [internalValue, setInternalValue] = useState();
  const handleInternalChange = ev => {
    setInternalValue(ev.target.value);
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={clsx(styles.inputWrapper, {
          [styles.small]: size === 'small',
          [styles.large]: size === 'large',
          [styles.hasLabel]: label,
        })}
      >
        <input
          className={clsx(styles.input, {
            [styles.darkBackground]: background === 'dark',
            [styles.lightBackground]: background === 'light',
            [styles.error]: errorMessage,
            [styles.filled]: props.value || internalValue,
          })}
          placeholder={label ? '' : placeholder}
          onChange={props.onChange || handleInternalChange}
          value={props.value || internalValue}
          {...props}
        />
        {label && <label className={styles.label}>{label}</label>}
      </div>
      {errorMessage && (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )}
    </div>
  );
}
