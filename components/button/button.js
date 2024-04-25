'use client';

import React, { forwardRef } from 'react';

import clsx from 'clsx';
import { decode } from 'html-entities';
import Image from 'next/image';
import Link from 'next/link';

import { getIcon } from '@lib/icons';

import styles from './button.module.scss';

function ButtonWithRef(
  {
    background = 'dark',
    children,
    className,
    download,
    fontStyle = null,
    footer,
    href = '',
    isBusy,
    isToggled = false,
    leftIcon = null,
    leftIconUrl = null,
    onToggleIconClick = null,
    rightIcon = null,
    rightIconUrl = null,
    shortenable,
    size = 'small',
    target = null,
    toggleable,
    type = 'button',
    variant = 'primary',
    ...props
  },
  ref,
) {
  const buttonClassNames = clsx(styles.button, className, {
    [styles.xsmall]: size === 'xsmall',
    [styles.small]: size === 'small',
    [styles.large]: size === 'large',
    [styles.mixed]: size === 'mixed',
    [styles.primary]: variant === 'primary',
    [styles.secondary]: variant === 'secondary',
    [styles.tertiary]: variant === 'tertiary',
    [styles.quaternary]: variant === 'quaternary',
    [styles.quinary]: variant === 'quinary',
    [styles.senary]: variant === 'senary',
    [styles.septenary]: variant === 'septenary',
    [styles.footerItem]: variant === 'footer-item',
    [styles.relatedPost]: variant === 'related-post',
    [styles.darkBackground]: background === 'dark',
    [styles.lightBackground]: background === 'light',
    [styles.leftIcon]: leftIcon || leftIconUrl,
    [styles.rightIcon]: rightIcon || rightIconUrl,
    [styles.toggleable]: toggleable,
    [styles.shortenable]: shortenable,
    [styles.noText]: !children,
    [styles.footer]: footer,
    [styles.isBusy]: isBusy,
  });

  const LeftIconSvg = getIcon(leftIcon);
  const RightIconSvg = getIcon(rightIcon);
  const ToggleableNeutralIconSvg = getIcon('expand-more-neutral');
  const ToggleablePrimaryIconSvg = getIcon('expand-more-primary');

  const childrenNormalized =
    typeof children === 'string' ? decode(children) : children;

  const buttonBody = (
    <>
      {LeftIconSvg && <LeftIconSvg />}
      {leftIconUrl && (
        <Image alt={''} height={20} src={leftIconUrl} width={20} />
      )}

      {shortenable ? (
        <span className={styles.shortenableWrapper}>
          <span className={styles.shortenableLabel}>{childrenNormalized}</span>
        </span>
      ) : (
        childrenNormalized
      )}

      {rightIconUrl && (
        <Image alt={''} height={20} src={rightIconUrl} width={20} />
      )}
      {RightIconSvg && <RightIconSvg />}
    </>
  );

  const buttonBodyWithOptionalSpinner =
    isBusy !== undefined ? (
      <>
        <span className={styles.labelWrapper}>{buttonBody}</span>
        <span className={styles.spinner} />
      </>
    ) : (
      buttonBody
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

  const LinkOrButton = href ? Link : 'button';

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

      <LinkOrButton
        className={buttonClassNames}
        fontStyle={fontStyle}
        href={href || null}
        ref={ref}
        target={target}
        type={href ? null : type}
        {...props}
      >
        {buttonBodyWithOptionalSpinner}
      </LinkOrButton>
    </OptionalToggleWrapperEl>
  );
}

const Button = forwardRef(ButtonWithRef);
export default Button;
