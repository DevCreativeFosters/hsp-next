import { makeRelativeUrl } from '@lib/helpers';

import Button from '@components/button/button';
import Container from '@components/container/container';

import styles from './button-link-tag.module.scss';

export default function ButtonLinkTag({ buttonLink, buttonText }) {
  const label = buttonText || buttonLink?.title;
  const href = buttonLink?.url ? makeRelativeUrl(buttonLink.url) : null;

  if (!label || !href) return null;

  const isExternal = /^https?:\/\//.test(href);
  const target = buttonLink?.target || (isExternal ? '_blank' : null);

  return (
    <section className={styles.block}>
      <Container flexibleBlockPadding>
        <div className={styles.inner}>
          <Button href={href} target={target} variant="primary">
            {label}
          </Button>
        </div>
      </Container>
    </section>
  );
}
