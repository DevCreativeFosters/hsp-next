'use client';

import { useEffect, useRef } from 'react';

import { useDownloadFileClick } from '@hooks/useDownloadFileClick';

import replacePdfLinks from '@lib/replace-pdf-links';

export default function DownloadLinkWrapper({ blockName, children, context }) {
  const containerRef = useRef();
  useEffect(function replaceLinks() {
    replacePdfLinks(containerRef.current);
  }, []);

  const { Modal, onDownloadFileClick } = useDownloadFileClick(context);

  const excludedBlocks = ['ChooseYourVehicle'];

  if (excludedBlocks.includes(blockName)) {
    return children;
  }

  return (
    <div onClick={onDownloadFileClick} ref={containerRef}>
      {children}
      {Modal}
    </div>
  );
}
