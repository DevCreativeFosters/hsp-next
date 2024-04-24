import Wysiwyg from '@components/wysiwyg/wysiwyg';

import styles from './html-field.module.scss';

export default function HtmlField({ field }) {
  const { content, databaseId: id } = field;

  return <Wysiwyg className={styles.htmlField} content={content} />;
}
