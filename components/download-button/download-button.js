'use client';

import { useState } from 'react';

import clsx from 'clsx';
import mergeImages from 'merge-images';

import { getIcon } from '@lib/icons';

import Loading from '@components/loading/loading';

import styles from './download-button.module.scss';

const DownloadIcon = getIcon('download');

export default function DownloadButton({ className, fileName, images }) {
  const [isLoading, setIsLoading] = useState(false);

  function downloadPreview() {
    setIsLoading(true);

    const filteredImages = images.filter(
      image => image !== null && image !== undefined,
    );

    mergeImages(filteredImages, {
      crossOrigin: 'anonymous',
    })
      .then(b64 => {
        var a = document.createElement('a');
        a.href = b64;
        a.download = fileName.replace(/ /g, '-').replace(/\//g, '-');
        a.click();
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        console.error(error);
      });
  }

  return (
    <button
      className={clsx(styles.downloadButton, className, {
        [styles.isLoading]: isLoading,
      })}
      onClick={() => downloadPreview()}
    >
      {isLoading ? <Loading /> : <DownloadIcon />}
    </button>
  );
}
