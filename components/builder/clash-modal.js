import clsx from 'clsx';

import Button from '@components/button/button';
import Modal from '@components/modal/modal';

import styles from './clash-modal.module.scss';

export default function ClashModal({
  currentProduct,
  incompatibleCovers,
  incompatibleFactoryOptions,
  selectedFactoryOptions,
  selectedProducts,
  setProductToAdd,
  setSelectedFactoryOptions,
  setShowModal,
}) {
  let title = 'Factory Options Clash';

  if (
    incompatibleCovers.length > 0 &&
    incompatibleFactoryOptions.length === 0
  ) {
    title = 'Cover Options Clash';
  } else if (
    incompatibleCovers.length > 0 &&
    incompatibleFactoryOptions.length > 0
  ) {
    title = 'Cover & Factory Options Clash';
  }

  return (
    <Modal
      isVisible={true}
      maxWidth={900}
      onClose={() => {
        setShowModal(false);
      }}
      title={title}
    >
      <>
        {incompatibleCovers.length > 0 && (
          <>
            <p>
              For this selected HSP product to be installed, it requires the
              below covers to be removed.
            </p>
            <ol
              className={clsx(styles.list, {
                [styles.listDivider]: incompatibleFactoryOptions.length > 0,
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
        {incompatibleFactoryOptions.length > 0 && (
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
        <p>Do you want to proceed?</p>
        <div className={styles.buttons}>
          <Button
            onClick={() => {
              setShowModal(false);
            }}
            size={'large'}
            variant={'secondary'}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setSelectedFactoryOptions(
                selectedFactoryOptions.filter(
                  option => !incompatibleFactoryOptions.includes(option.value),
                ),
              );

              if (incompatibleCovers.length > 0) {
                selectedProducts.shift();
              }

              setProductToAdd(currentProduct);
              setShowModal(false);
            }}
            size={'large'}
          >
            Accept
          </Button>
        </div>
      </>
    </Modal>
  );
}
