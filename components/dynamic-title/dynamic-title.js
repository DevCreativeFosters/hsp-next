'use client';

import { clsx } from 'clsx';

export default function DynamicTitle({
  children,
  className,
  defaultTag = 'h2',
  titleTag,
  titleTagStyle,
}) {
  const TitleTag = titleTag?.length ? titleTag[0] : defaultTag;

  return (
    <TitleTag className={clsx(className, titleTagStyle || TitleTag)}>
      {children}
    </TitleTag>
  );
}
