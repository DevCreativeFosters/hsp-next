import Wysiwyg from '@components/wysiwyg/wysiwyg';
import styles from './html-field.module.scss';

export default function HtmlField({ field }) {
  const { databaseId: id, content } = field;

  return <Wysiwyg className={styles.htmlField} content={content} />;
}
