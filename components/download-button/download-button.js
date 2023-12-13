'use client';

import { useState } from 'react';
import mergeImages from 'merge-images';
import clsx from 'clsx';
import Loading from '@components/loading/loading';
import styles from './download-button.module.scss';
import { getIcon } from '@lib/icons';

const DownloadIcon = getIcon('download');

export default function DownloadButton({ images, fileName, className }) {
  const [isLoading, setIsLoading] = useState(false);

  function downloadPreview() {
    setIsLoading(true);

    mergeImages(images, {
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
