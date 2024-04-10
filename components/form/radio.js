'use client';

import { useState } from 'react';

import clsx from 'clsx';

import styles from './radio.module.scss';

export default function Radio({
  background = 'dark',
  errorMessage = '',
  halfWidth = false,
  label = '',
  name,
  options = [],
  required,
  type = 'text',
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
              className={clsx(styles.radioLabel, {
                [styles.error]: errorMessage,
                [styles.filled]: isChecked,
              })}
              key={optionValue}
            >
              <input
                checked={isChecked}
                className={styles.realInputElement}
                name={name}
                onChange={props.onChange || handleInternalChange}
                required={required}
                type="radio"
                value={optionValue}
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
