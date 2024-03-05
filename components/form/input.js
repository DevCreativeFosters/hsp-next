'use client';

import { forwardRef, useState } from 'react';
import clsx from 'clsx';
import styles from './input.module.scss';

function InputWithRef(
  {
    className,
    type = 'text',
    size = 'large',
    background = 'dark',
    errorMessage = '',
    placeholder = '',
    label = '',
    halfWidth = false,
    required,
    customRef,
    ...props
  },
  ref,
) {
  // Internal values are used for demos purposes to make component work with basic props
  // If would you like to use it along with other components please pass `onChange` and `value` props
  const [internalValue, setInternalValue] = useState('');
  const handleInternalChange = ev => {
    setInternalValue(ev.target.value);
  };

  return (
    <div
      className={clsx(styles.wrapper, {
        [styles.halfWidth]: halfWidth,
      })}
    >
      <div
        className={clsx(
          styles.inputWrapper,
          {
            [styles.small]: size === 'small',
            [styles.large]: size === 'large',
            [styles.hasLabel]: label,
          },
          className,
        )}
      >
        <input
          ref={ref}
          type={type}
          className={clsx(styles.input, {
            [styles.textarea]: type === 'textarea',
            [styles.darkBackground]: background === 'dark',
            [styles.lightBackground]: background === 'light',
            [styles.error]: errorMessage,
            [styles.filled]: props.value || internalValue,
          })}
          placeholder={label ? '' : placeholder}
          onChange={props.onChange || handleInternalChange}
          value={props.value || internalValue}
          required={required}
          {...props}
        />
        {label && (
          <label className={styles.label}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        )}
      </div>
      {errorMessage && (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )}
    </div>
  );
}

const Input = forwardRef(InputWithRef);
export default Input;
