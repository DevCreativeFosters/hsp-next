'use client';

import { getFileName } from '@lib/get-file-name';
import { useEffect, useRef } from 'react';
import { useDownloadFileClick } from '@hooks/useDownloadFileClick';
import { isPdf } from '@lib/file-types';

export default function DownloadLinkWrapper({ context, children }) {
  const containerRef = useRef();

  useEffect(function replaceLinks() {
    Array.from(containerRef.current.querySelectorAll('a[href]'))?.map(link => {
      if (isPdf(link.href)) {
        const href = String(link.href);
        if (href) {
          link.removeAttribute('href');
          link.setAttribute('data-type', 'attachment');
          link.setAttribute('data-href', href);
          link.setAttribute('download', getFileName(href));
          link.setAttribute('target', '_blank');
        }
      }
    });
  }, []);

  const { onDownloadFileClick, Modal } = useDownloadFileClick(context);
  return (
    <div ref={containerRef} onClick={onDownloadFileClick}>
      {children}
      {Modal}
    </div>
  );
}
