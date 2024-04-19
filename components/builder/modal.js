import Button from '@components/button/button';
import Modal from '@components/modal/modal';

import styles from './modal.module.scss';

export default function UTEBuilderModal({
  children,
  isVisible,
  maxWidth,
  onAccept,
  onClose,
  title,
}) {
  return (
    <Modal
      isVisible={isVisible}
      maxWidth={maxWidth}
      onClose={onClose}
      title={title}
    >
      <>
        {children}
        <p>Do you want to proceed?</p>
        <div className={styles.buttons}>
          <Button onClick={onClose} size={'large'} variant={'secondary'}>
            Cancel
          </Button>
          <Button onClick={onAccept} size={'large'}>
            Accept
          </Button>
        </div>
      </>
    </Modal>
  );
}
