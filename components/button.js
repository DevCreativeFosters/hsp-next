import { getIcon } from '@lib/icons';
import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';
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
  footer,
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
    [styles.quinary]: variant === 'quinary',
    [styles.footerItem]: variant === 'footer-item',
    [styles.darkBackground]: background === 'dark',
    [styles.lightBackground]: background === 'light',
    [styles.leftIcon]: leftIcon,
    [styles.rightIcon]: rightIcon,
    [styles.toggleable]: toggleable,
    [styles.noText]: !children,
    [styles.footer]: footer
  });

  const LeftIconSvg = getIcon(leftIcon);
  const RightIconSvg = getIcon(rightIcon);
  const ToggleableNeutralIconSvg = getIcon('expand-more-neutral');
  const ToggleablePrimaryIconSvg = getIcon('expand-more-primary');

  const buttonBody = (
    <>
      {LeftIconSvg && <LeftIconSvg />}
      {children}
      {RightIconSvg && <RightIconSvg />}
    </>
  );

  const OptionalToggleWrapperEl = toggleable ? 'div' : React.Fragment;
  const optionalToggleWrapperElProps = {
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
    <OptionalToggleWrapperEl {...optionalToggleWrapperElProps}>
      {toggleable && (
        <ToggleContainer
          className={clsx(
            styles.toggleContainer,
            isToggled ? styles.isToggled : null,
          )}
          {...ToggleContainerProps}
        >
          {toggleable.includes('neutral') && <ToggleableNeutralIconSvg />}
          {toggleable.includes('primary') && <ToggleablePrimaryIconSvg />}
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
