import Button from '@components/button/button';
import Modal from '@components/modal/modal';

import styles from './clash-modal.module.scss';

export default function ClashModal({
  currentProduct,
  incompatibleFactoryOptions,
  selectedFactoryOptions,
  selectedProducts,
  setSelectedFactoryOptions,
  setSelectedProducts,
  setShowModal,
}) {
  return (
    <Modal
      isVisible={true}
      maxWidth={900}
      onClose={() => {
        setShowModal(false);
      }}
      title="Factory Options Clash"
    >
      <p>
        For this selected HSP product to be installed, it requires the below
        factory options to be removed.
      </p>

      <ol className={styles.list}>
        {incompatibleFactoryOptions.map((option, index) => (
          <li key={index}>
            <span className={styles.listItem}>{option}</span>
          </li>
        ))}
      </ol>
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
            setSelectedProducts([currentProduct, ...selectedProducts]);
            setShowModal(false);
          }}
          size={'large'}
        >
          Accept
        </Button>
      </div>
    </Modal>
  );
}
