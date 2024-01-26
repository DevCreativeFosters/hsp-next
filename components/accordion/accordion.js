'use client';

import React, { useState, useCallback } from 'react';

export default function Accordion({ children }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleItem = useCallback(
    index => {
      setActiveIndex(activeIndex === index ? null : index);
    },
    [activeIndex],
  );

  return (
    <div>
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, {
          isOpen: index === activeIndex,
          onToggle: () => toggleItem(index),
        }),
      )}
    </div>
  );
}
