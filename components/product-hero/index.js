import Image from 'next/image';
import Button from '@components/button/button';
import ContentBox from '@components/content-box/content-box';
import Wysiwyg from '@components/wysiwyg/wysiwyg';
import styles from './product-hero.module.scss';

export default function ProductHero({
  make,
  title,
  description,
  button,
  image,
  features,
  warranty,
}) {
  const slogan = make ? `for ${make}` : '100% Australian';

  return (
    <div className={styles.hero}>
      <div className={styles.header}>
        {title && (
          <h1 className={styles.title}>
            {title}
            <br />
            <span className={styles.slogan}>{slogan}</span>
          </h1>
        )}
        {description && <p className={styles.description}>{description}</p>}
        {button && (
          <Button href={button.url} size="large">
            {button.label}
          </Button>
        )}
      </div>
      {image && (
        <div className={styles.image}>
          <Image
            src={image.mediaItemUrl}
            alt=""
            height={image.mediaDetails.height}
            width={image.mediaDetails.width}
          />
        </div>
      )}
      {features && (
        <div className={styles.features}>
          <ContentBox>
            <h3 className={styles.contentBoxTitle}>Features</h3>
            {features.content && <Wysiwyg content={features.content} />}
          </ContentBox>
        </div>
      )}
      {warranty && (
        <div className={styles.warranty}>
          <ContentBox className={styles.warrantyDescription}>
            <h3 className={styles.contentBoxTitle}>
              Warranty{' '}
              {warranty.years && (
                <span className={styles.years}>+{warranty.years} years</span>
              )}
            </h3>
            {warranty.content && <p>{warranty.content}</p>}
          </ContentBox>
        </div>
      )}
    </div>
  );
}
