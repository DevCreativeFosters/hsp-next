'use client';

import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { getFileName } from '@lib/get-file-name';
import { LOCAL_STORAGE_DOWNLOAD_FILE_EMAIL } from '@lib/local-storage';

import Button from '@components/button/button';
import DownloadFileModal from '@components/download-file-modal/download-file-modal';

export default function DownloadFileButton({
  children,
  downloadFileFormId,
  fileName,
  href,
  label,
  ...props
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [buttonHref, setButtonHref] = useState(null);
  const buttonRef = useRef();

  const fileNameNormalized = useMemo(() => {
    return fileName || getFileName(href);
  }, [fileName, href]);

  const onDownloadButtonClick = useCallback(
    ev => {
      if (!buttonHref && href) {
        ev.preventDefault();
        if (localStorage.getItem(LOCAL_STORAGE_DOWNLOAD_FILE_EMAIL)) {
          setButtonHref(href);
        } else {
          setIsModalVisible(true);
        }
      }
    },
    [buttonHref, href],
  );

  const onClose = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  useEffect(
    function triggerClickOnButtonHrefUpdate() {
      if (buttonHref) {
        buttonRef.current.click();
        setButtonHref('');
      }
    },
    [buttonHref],
  );

  return (
    <Fragment>
      <Button
        download={fileNameNormalized}
        href={buttonHref}
        onClick={onDownloadButtonClick}
        ref={buttonRef}
        target="_blank"
        {...props}
      >
        {children}
      </Button>

      <DownloadFileModal
        downloadFileFormId={downloadFileFormId}
        fileName={fileNameNormalized}
        href={href}
        isVisible={isModalVisible}
        onClose={onClose}
      />
    </Fragment>
  );
}
