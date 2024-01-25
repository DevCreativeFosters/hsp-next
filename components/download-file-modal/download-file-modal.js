'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { LOCAL_STORAGE_DOWNLOAD_FILE_EMAIL } from '@lib/local-storage';
import Modal from '@components/modal/modal';
import Loading from '@components/loading/loading';
import Button from '@components/button/button';
import GravityFormWrapper from '@components/gravity-forms/gravity-form-wrapper';
import DisclaimerTC from '@components/disclaimer-tc/disclaimer-tc';
import styles from './download-file-modal.module.scss';

export default function DownloadFileModal({
  href,
  fileName,
  isVisible,
  onClose = () => {},
}) {
  const [formId, setFormId] = useState(null);
  const [email, setEmail] = useState('');
  const [isFormReady, setIsFormReady] = useState(false);
  const [isFormBusy, setIsFormBusy] = useState(false);
  const fileLinkRef = useRef();
  const gravityFormRef = useRef();

  const [downloadNow, setDownloadNow] = useState(false);

  const onGravityFormLoad = useCallback(ev => {
    setIsFormReady(true);
  }, []);

  const onGravityFormChange = useCallback(ev => {
    if (ev.target.type === 'email') {
      setEmail(ev.target.value);
    }
  }, []);

  const onGravityFormSubmit = useCallback(() => {
    setIsFormBusy(true);
  }, []);

  const onGravityFormSuccess = useCallback(() => {
    setIsFormBusy(false);
    localStorage.setItem(LOCAL_STORAGE_DOWNLOAD_FILE_EMAIL, email); // save in LS for future downloads
    setDownloadNow(true);
  }, [email]);

  const onGravityFormError = useCallback(() => {
    setIsFormBusy(false);
  }, []);

  useEffect(
    function triggerDownloadAndCloseModal() {
      if (downloadNow && fileLinkRef.current) {
        fileLinkRef.current.click();
        setDownloadNow(false);
        setEmail('');
        onClose();
      }
    },
    [downloadNow, onClose],
  );

  useEffect(
    function resetIsFormReadyUponModalClose() {
      if (!isVisible) {
        setIsFormReady(false);
      }
    },
    [isVisible],
  );

  useEffect(function syncFormId() {
    const id = parseInt(
      document.documentElement.getAttribute('data-download-file-form-id'),
    );
    if (id) {
      setFormId(id);
    }
  }, []);

  return (
    <Modal
      title="Download"
      isVisible={isVisible}
      maxWidth={900}
      onClose={onClose}
    >
      <div
        className={clsx(styles.contentGrid, {
          [styles.isFormReady]: isFormReady,
        })}
      >
        <div className={styles.info}>
          <span>You are about to download a file:</span>
          <div className={styles.fileName}>{fileName}</div>
        </div>

        <div className={styles.instruction}>
          In order to download our files please provide your e-mail address.
        </div>

        <div className={styles.email}>
          <div className={styles.spinner}>
            <Loading color="white" size="large" />
          </div>
          <div className={styles.gravityForm}>
            <GravityFormWrapper
              ref={gravityFormRef}
              attributes={{ id: formId }}
              submitButton={false}
              preventConfirmation
              onLoad={onGravityFormLoad}
              onChange={onGravityFormChange}
              onSubmit={onGravityFormSubmit}
              onSuccess={onGravityFormSuccess}
              onError={onGravityFormError}
              hiddenInputs={[
                {
                  inputName: 'filename',
                  value: fileName,
                },
              ]}
            />
          </div>
        </div>

        <div className={styles.disclaimer}>
          <DisclaimerTC />
        </div>

        <Button
          className={styles.button}
          type="button"
          rightIcon="download"
          size="large"
          isBusy={isFormBusy}
          disabled={isFormBusy}
          onClick={() => gravityFormRef.current?.handleSubmit?.()}
        >
          Download
        </Button>

        {downloadNow && href && (
          <Link
            className={styles.hiddenLink}
            href={href}
            ref={fileLinkRef}
            download={fileName}
            target="_blank"
          >
            {fileName}
          </Link>
        )}
      </div>
    </Modal>
  );
}
