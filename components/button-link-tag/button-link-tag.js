import { makeRelativeUrl } from '@lib/helpers';

import Button from '@components/button/button';
import Container from '@components/container/container';

import styles from './button-link-tag.module.scss';

export default function ButtonLinkTag({ buttonLink, buttonText }) {
  const label = buttonText || buttonLink?.title;
  const href = buttonLink?.url ? makeRelativeUrl(buttonLink.url) : null;

  if (!label || !href) return null;

  return (
    <section className={styles.block}>
      <Container>
        <div className={styles.inner}>
          <Button
            href={href}
            target={buttonLink?.target || null}
            variant="primary"
          >
            {label}
          </Button>
        </div>
      </Container>
    </section>
  );
}
