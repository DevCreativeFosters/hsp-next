'use client';

import React, { useCallback, useState } from 'react';

export default function Accordion({
  alwaysOpen = false,
  children,
  className,
  openFirstByDefault = false,
}) {
  const [activeIndex, setActiveIndex] = useState(openFirstByDefault ? 0 : -1);

  const toggleItem = useCallback(
    index => {
      if (activeIndex === index) {
        if (!alwaysOpen) {
          setActiveIndex(-1);
        } else if (children.length > 1) {
          setActiveIndex(index === 0 ? 1 : 0);
        }
      } else {
        setActiveIndex(index);
      }
    },
    [activeIndex, alwaysOpen, children.length],
  );

  return (
    <div className={className}>
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, {
          isOpen: index === activeIndex,
          onToggle: () => toggleItem(index),
        }),
      )}
    </div>
  );
}
