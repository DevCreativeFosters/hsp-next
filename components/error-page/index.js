import routes from '@lib/routes';
import Button from '@components/button/button';
import styles from './index.module.scss';

export default function ErrorPage({ title, text, buttonText, product }) {
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.text}>{text}</p>
        <Button
          href={product ? routes.products : routes.home}
          leftIcon={product ? 'arrow-backward' : 'homepage'}
          size="large"
        >
          {buttonText}
        </Button>
      </div>
      <div className={styles.help}>
        <h4 className={styles.helpTitle}>Need help?</h4>
        <p className={styles.helpText}>
          If you need support, please contact us on{' '}
          <a className={styles.link} href="tel:1300441498">
            1300 441 498
          </a>{' '}
          or send an email to{' '}
          <a className={styles.link} href="mailto:info@hsputelids.com">
            info@hsputelids.com
          </a>
        </p>
      </div>
    </div>
  );
}
