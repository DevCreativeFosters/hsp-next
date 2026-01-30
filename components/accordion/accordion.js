'use client';

import React, { useCallback, useState } from 'react';

export default function Accordion({
  allowMultipleOpen = false,
  children,
  className,
  keepOneOpen = false,
  openFirstByDefault = false,
  stickyOnMobile = false,
  stickyTopOffset,
}) {
  const [activeIndex, setActiveIndex] = useState(openFirstByDefault ? 0 : -1);

  // Use array of active indices if allowing multiple open items
  const [activeIndices, setActiveIndices] = useState(() => {
    if (openFirstByDefault) {
      return [0];
    }
    return [];
  });

  const toggleItem = useCallback(
    index => {
      if (allowMultipleOpen) {
        if (activeIndices.includes(index)) {
          if (keepOneOpen && activeIndices.length === 1) {
            return;
          }
          setActiveIndices(prev => prev.filter(i => i !== index));
        } else {
          setActiveIndices(prev => [...prev, index]);
        }
      } else {
        // Single open item logic
        if (activeIndex === index) {
          if (!keepOneOpen) {
            setActiveIndex(-1);
          } else if (children.length > 1) {
            setActiveIndex(index === 0 ? 1 : 0);
          }
        } else {
          setActiveIndex(index);
        }
      }
    },
    [
      activeIndex,
      activeIndices,
      allowMultipleOpen,
      children?.length,
      keepOneOpen,
    ],
  );

  return (
    <div className={className}>
      {React.Children.map(
        children,
        (child, index) =>
          child &&
          React.cloneElement(child, {
            isOpen:
              allowMultipleOpen || child.props.isOpen
                ? activeIndices.includes(index)
                : index === activeIndex,
            onToggle: () => toggleItem(index),
            stickyOnMobile: stickyOnMobile,
            stickyTopOffset: stickyTopOffset,
          }),
      )}
    </div>
  );
}
