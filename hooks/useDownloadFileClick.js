'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { isPdf } from '@lib/file-types';
import { getFileName } from '@lib/get-file-name';
import { LOCAL_STORAGE_DOWNLOAD_FILE_EMAIL } from '@lib/local-storage';

import DownloadFileModal from '@components/download-file-modal/download-file-modal';

export const useDownloadFileClick = () => {
  const [href, setHref] = useState('');
  const [fileName, setFileName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [downloadNow, setDownloadNow] = useState(false);

  const elRef = useRef();

  const onDownloadFileClick = useCallback(
    ev => {
      const el = ev.target;
      const isAttachment = el?.getAttribute('data-type') === 'attachment';
      const elHref = el?.href || el?.getAttribute('data-href');
      const isHrefPdf = isPdf(elHref);

      if (isAttachment || isHrefPdf) {
        const fn = getFileName(elHref);
        setHref(elHref);
        setFileName(fn);

        if (!localStorage.getItem(LOCAL_STORAGE_DOWNLOAD_FILE_EMAIL)) {
          setIsModalVisible(true);
        } else if (!downloadNow) {
          ev.preventDefault();
          elRef.current = el;
          setDownloadNow(true);
        }
      }
    },
    [downloadNow, href],
  );

  useEffect(
    function triggerClickOnFlagUpdate() {
      const el = elRef.current;
      if (el && href && downloadNow) {
        el.setAttribute('href', href);
        el.click();
        el.removeAttribute('href');
        setDownloadNow(false);
      }
    },
    [downloadNow, href],
  );
  const Modal = (
    <DownloadFileModal
      href={href}
      fileName={fileName}
      isVisible={isModalVisible}
      onClose={() => setIsModalVisible(false)}
    />
  );

  return {
    onDownloadFileClick,
    Modal,
  };
};
