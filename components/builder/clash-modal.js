import styles from '@components/builder/builder.module.scss';
import Button from '@components/button/button';
import Modal from '@components/modal/modal';

export default function ClashModal({
  setShowModal,
  factoryOption,
  currentProduct,
  selectedProducts,
  setFactoryOption,
  setSelectedProducts,
}) {
  return (
    <Modal
      title="Factory Options Clash"
      isVisible={true}
      maxWidth={900}
      onClose={() => {
        setShowModal(false);
      }}
    >
      <p>
        For this selected HSP product to be installed, it requires the below
        factory options to be removed.
      </p>

      <ol className={styles.list}>
        <li>
          <span className={styles.listItem}>{factoryOption.name}</span>
        </li>
      </ol>
      <p>Do you want to proceed?</p>
      <div className={styles.buttons}>
        <Button
          variant={'secondary'}
          size={'large'}
          onClick={() => {
            setShowModal(false);
          }}
        >
          Cancel
        </Button>
        <Button
          size={'large'}
          onClick={() => {
            setFactoryOption(null);
            setSelectedProducts([currentProduct, ...selectedProducts]);
            setShowModal(false);
          }}
        >
          Accept
        </Button>
      </div>
    </Modal>
  );
}
