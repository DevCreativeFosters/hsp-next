import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import { getIcon } from '@lib/icons';
import styles from '@styles/button.module.scss';

export default function Button({
  size = 'small',
  variant = 'primary',
  background = 'dark',
  fontStyle = {},
  leftIcon = null,
  rightIcon = null,
  toggleable = null,
  isToggled = false,
  onToggleIconClick = null,
  href = '',
  type = 'button',
  children,
  ...props
}) {
  const buttonClassNames = clsx(styles.button, {
    [styles.xsmall]: size === 'xsmall',
    [styles.small]: size === 'small',
    [styles.large]: size === 'large',
    [styles.primary]: variant === 'primary',
    [styles.secondary]: variant === 'secondary',
    [styles.tertiary]: variant === 'tertiary',
    [styles.quaternary]: variant === 'quaternary',
    [styles.darkBackground]: background === 'dark',
    [styles.lightBackground]: background === 'light',
    [styles.leftIcon]: leftIcon,
    [styles.rightIcon]: rightIcon,
    [styles.toggleable]: toggleable,
    [styles.noText]: !children,
  });

  const leftIconProps = getIcon(leftIcon);
  const rightIconProps = getIcon(rightIcon);

  const toggleableNeutralIconProps = getIcon('expand-more-neutral');
  const toggleablePrimaryIconProps = getIcon('expand-more-primary');

  const buttonBody = (
    <>
      {leftIconProps && <Image {...leftIconProps} alt={leftIconProps.alt} />}
      {children}
      {rightIconProps && <Image {...rightIconProps} alt={rightIconProps.alt} />}
    </>
  );

  const OptionalToggleWrapperEl = toggleable ? 'div' : React.Fragment;
  const OptionalToggleWrapperElProps = {
    ...(toggleable && { className: styles.optionalToggleWrapper }),
  };

  const ToggleContainer = onToggleIconClick ? Button : 'div';
  const ToggleContainerProps = {
    ...(onToggleIconClick && {
      onClick: onToggleIconClick,
      type: 'button',
    }),
  };

  if (href) {
    return (
      <Link
        href={href}
        className={buttonClassNames}
        style={fontStyle}
        {...props}
      >
        {buttonBody}
      </Link>
    );
  }

  return (
    <OptionalToggleWrapperEl {...OptionalToggleWrapperElProps}>
      {toggleable && (
        <ToggleContainer
          className={clsx(
            styles.toggleContainer,
            isToggled ? styles.isToggled : null,
          )}
          {...ToggleContainerProps}
        >
          {toggleable.includes('neutral') && (
            <Image
              className={styles.toggleIcon}
              {...toggleableNeutralIconProps}
              alt={toggleableNeutralIconProps.alt}
            />
          )}
          {toggleable.includes('primary') && (
            <Image
              className={styles.toggleIcon}
              {...toggleablePrimaryIconProps}
              alt={toggleablePrimaryIconProps.alt}
            />
          )}
        </ToggleContainer>
      )}

      <button
        className={buttonClassNames}
        type={type}
        fontStyle={fontStyle}
        {...props}
      >
        {buttonBody}
      </button>
    </OptionalToggleWrapperEl>
  );
}
