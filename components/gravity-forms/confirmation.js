import parse from 'html-react-parser';
import Button from '@components/button/button';
import styles from './confirmation.module.scss';

export default function Confirmation({
  resetForm = () => null,
  content = null,
}) {
  return (
    <div className={styles.confirmation}>
      {parse(content)}
      <Button onClick={resetForm}>Back to the form</Button>
    </div>
  );
}
