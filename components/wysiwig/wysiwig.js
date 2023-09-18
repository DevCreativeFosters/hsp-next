import clsx from 'clsx';
import styles from './wysiwyg.module.scss';

export default function Wysiwyg({ className, content }) {
  return (
    <div className={clsx(styles.wysiwyg, className)}>
      {content && <div dangerouslySetInnerHTML={{ __html: content }} />}
    </div>
  );
}
