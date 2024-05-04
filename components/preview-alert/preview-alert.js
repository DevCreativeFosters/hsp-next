import { draftMode, headers } from 'next/headers';

import styles from './preview-alert.module.scss';

export default function Alert() {
  /**
   * This component only works as a Server Side Component,
   * so it is included in the app/layout.js file.
   *
   * Exit link is NOT a <Link> on purpose, to ensure full page reload.
   */
  const { isEnabled } = draftMode();
  const headersList = headers();
  const pathname = `${
    headersList.get('next-url') || headersList.get('x-invoke-path') || ''
  }/`.replace(/\/\//, '/');

  if (!isEnabled) {
    return;
  }

  return (
    <div className={styles.alert}>
      <h2 className={styles.heading}>Heads up</h2>
      <p>You&apos;re in the preview mode.</p>
      <a
        className={styles.exitLink}
        href={`/api/preview/exit/?redirect=${encodeURIComponent(pathname)}`}
      >
        Click here to exit.
      </a>
    </div>
  );
}
