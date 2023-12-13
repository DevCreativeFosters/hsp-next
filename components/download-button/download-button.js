'use client';

import mergeImages from 'merge-images';

import clsx from 'clsx';
import styles from './download-button.module.scss';
import { getIcon } from '@lib/icons';

const DownloadIcon = getIcon('download');

export default function DownloadButton({ images, fileName, className }) {
  function downloadPreview() {
    mergeImages(images, {
      crossOrigin: 'anonymous',
    }).then(b64 => {
      var a = document.createElement('a');
      a.href = b64;
      a.download = fileName.replace(/ /g, '-').replace(/\//g, '-');
      a.click();
    });
  }

  return (
    <button
      className={clsx(styles.downloadButton, className)}
      onClick={() => downloadPreview()}
    >
      <DownloadIcon />
    </button>
  );
}
