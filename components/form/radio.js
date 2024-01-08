'use client';

import { useState } from 'react';
import clsx from 'clsx';
import styles from './radio.module.scss';

export default function Radio({
  type = 'text',
  background = 'dark',
  errorMessage = '',
  label = '',
  halfWidth = false,
  required,
  options = [],
  name,
  ...props
}) {
  const [internalValue, setInternalValue] = useState();
  const handleInternalChange = ev => {
    setInternalValue(ev.target.value);
  };

  return (
    <div
      className={clsx(styles.wrapper, {
        [styles.halfWidth]: halfWidth,
        [styles.darkBackground]: background === 'dark',
        [styles.lightBackground]: background === 'light',
      })}
    >
      {label && (
        <label className={styles.title}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <fieldset {...props} className={clsx(styles.inputWrapper)}>
        {options.map(({ text, value: optionValue }) => {
          const isChecked = (props.value || internalValue) === optionValue;

          return (
            <label
              className={clsx(styles.radioInput, {
                [styles.error]: errorMessage,
                [styles.filled]: isChecked,
              })}
              key={optionValue}
            >
              <input
                type="radio"
                name={name}
                checked={isChecked}
                value={optionValue}
                onChange={props.onChange || handleInternalChange}
                required={required}
              />
              <div className={styles.radioMark} />
              <span className={styles.label}>{text}</span>
            </label>
          );
        })}
      </fieldset>
      {errorMessage && (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )}
    </div>
  );
}
