import UTEBuilderModal from '@components/builder/modal';

export default function ResetModal({ onAccept, onClose }) {
  return (
    <UTEBuilderModal
      isVisible={true}
      maxWidth={900}
      onAccept={onAccept}
      onClose={onClose}
      title={'Reset Your Build?'}
    >
      <>
        <p>
          You are about to reset your chosen vehicle settings, which will effect
          your current UTE Builder selections. You will be re-directed to the
          beginning of the building process.
        </p>
      </>
    </UTEBuilderModal>
  );
}
