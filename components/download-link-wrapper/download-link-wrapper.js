'use client';

import { useEffect, useRef } from 'react';

import { useDownloadFileClick } from '@hooks/useDownloadFileClick';

import replacePdfLinks from '@lib/replace-pdf-links';

export default function DownloadLinkWrapper({ blockName, context, children }) {
  const containerRef = useRef();
  useEffect(function replaceLinks() {
    replacePdfLinks(containerRef.current);
  }, []);

  const { onDownloadFileClick, Modal } = useDownloadFileClick(context);

  const excludedBlocks = ['ChooseYourVehicle'];

  if (excludedBlocks.includes(blockName)) {
    return children;
  }

  return (
    <div ref={containerRef} onClick={onDownloadFileClick}>
      {children}
      {Modal}
    </div>
  );
}
