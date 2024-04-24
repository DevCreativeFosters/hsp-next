import clsx from 'clsx';

import styles from './clash-modal.module.scss';
import UTEBuilderModal from './modal';

export default function ClashModal({
  incompatibleCovers,
  incompatibleFactoryOptions,
  onAccept,
  onClose,
}) {
  let title = 'Factory Options Clash';

  if (incompatibleCovers.length > 0 && !incompatibleFactoryOptions) {
    title = 'Cover Options Clash';
  } else if (
    incompatibleCovers.length > 0 &&
    incompatibleFactoryOptions?.length > 0
  ) {
    title = 'Cover & Factory Options Clash';
  }

  return (
    <UTEBuilderModal
      isVisible={true}
      maxWidth={900}
      onAccept={onAccept}
      onClose={onClose}
      title={title}
    >
      <>
        {incompatibleCovers.length > 0 && (
          <>
            <p>
              For this selected HSP product to be installed, it requires the
              below covers to be removed. Be aware that removing these covers
              will reset your build.
            </p>
            <ol
              className={clsx(styles.list, {
                [styles.listDivider]: incompatibleFactoryOptions?.length > 0,
              })}
            >
              {incompatibleCovers.map((option, index) => (
                <li key={index}>
                  <span className={styles.listItem}>{option}</span>
                </li>
              ))}
            </ol>
          </>
        )}
        {incompatibleFactoryOptions?.length > 0 && (
          <>
            For this selected HSP product to be installed, it requires the below
            factory options to be removed.
            <ol className={styles.list}>
              {incompatibleFactoryOptions.map((option, index) => (
                <li key={index}>
                  <span className={styles.listItem}>{option}</span>
                </li>
              ))}
            </ol>
          </>
        )}
      </>
    </UTEBuilderModal>
  );
}
