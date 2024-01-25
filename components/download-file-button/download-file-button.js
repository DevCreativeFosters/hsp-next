'use client';

import { getFileName } from '@lib/get-file-name';
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { LOCAL_STORAGE_DOWNLOAD_FILE_EMAIL } from '@lib/local-storage';
import Button from '@components/button/button';
import DownloadFileModal from '@components/download-file-modal/download-file-modal';

export default function DownloadFileButton({
  href,
  fileName,
  label,
  children,
  downloadFileFormId,
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
        ref={buttonRef}
        href={buttonHref}
        onClick={onDownloadButtonClick}
        download={fileNameNormalized}
        target="_blank"
        {...props}
      >
        {children}
      </Button>

      <DownloadFileModal
        href={href}
        fileName={fileNameNormalized}
        isVisible={isModalVisible}
        downloadFileFormId={downloadFileFormId}
        onClose={onClose}
      />
    </Fragment>
  );
}
