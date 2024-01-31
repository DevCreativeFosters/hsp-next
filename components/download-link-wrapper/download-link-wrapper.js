'use client';

import replacePdfLinks from '@lib/replace-pdf-links';
import { useEffect, useRef } from 'react';
import { useDownloadFileClick } from '@hooks/useDownloadFileClick';

export default function DownloadLinkWrapper({ context, children }) {
  const containerRef = useRef();
  useEffect(function replaceLinks() {
    replacePdfLinks(containerRef.current);
  }, []);

  const { onDownloadFileClick, Modal } = useDownloadFileClick(context);
  return (
    <div ref={containerRef} onClick={onDownloadFileClick}>
      {children}
      {Modal}
    </div>
  );
}
