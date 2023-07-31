import Link from 'next/link';
import clsx from 'clsx';
import styles from '@/styles/button.module.scss';

export default function Button({
  size = 'small',
  variant = 'primary',
  background = 'dark',
  leftIcon = null, // check https://fonts.google.com/icons for icon names
  rightIcon = null, // check https://fonts.google.com/icons for icon names
  href = '',
  type = 'button',
  children,
  ...props
}) {
  const buttonClassNames = clsx(styles.button, {
    [styles.small]: size === 'small',
    [styles.large]: size === 'large',
    [styles.primary]: variant === 'primary',
    [styles.secondary]: variant === 'secondary',
    [styles.tertiary]: variant === 'tertiary',
    [styles.darkBackground]: background === 'dark',
    [styles.lightBackground]: background === 'light',
    [styles.leftIcon]: leftIcon,
    [styles.rightIcon]: rightIcon,
    [styles.noText]: !children,
  });
  const buttonBody = (
    <>
      {leftIcon && <i className="material-icon">{leftIcon}</i>}
      {children}
      {rightIcon && <i className="material-icon">{rightIcon}</i>}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={buttonClassNames} {...props}>
        {buttonBody}
      </Link>
    );
  }

  return (
    <button className={buttonClassNames} type={type} {...props}>
      {buttonBody}
    </button>
  );
}
