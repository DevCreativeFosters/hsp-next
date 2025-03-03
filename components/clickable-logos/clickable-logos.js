import Image from 'next/image';

import Container from '@components/container/container';
import DynamicTitle from '@components/dynamic-title/dynamic-title';

import styles from './clickable-logos.module.scss';

export default function ClickableLogos({
  bodyText,
  logos,
  title,
  titleTag,
  titleTagStyle,
}) {
  const LinkOrDiv = ({ children, className, link, logo }) => {
    if (link?.url) {
      return (
        <a
          aria-label={logo?.node?.altText || link?.title || 'Logo'}
          className={className}
          href={link.url}
          target={link?.target || '_self'}
        >
          {children}
        </a>
      );
    }
    return <div className={className}>{children}</div>;
  };

  return (
    <Container className={styles.container}>
      {title && (
        <DynamicTitle
          className={styles.title}
          titleTag={titleTag}
          titleTagStyle={titleTagStyle}
        >
          {title}
        </DynamicTitle>
      )}
      {bodyText && (
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: bodyText }}
        />
      )}
      {Array.isArray(logos) && logos.length > 0 ? (
        <ul className={styles.logos}>
          {logos.map(({ link, logo }, index) => (
            <li className={styles.logoItem} key={index}>
              <LinkOrDiv className={styles.logoWrapper} link={link}>
                <Image
                  alt={logo?.node?.altText || link?.title || ''}
                  className={styles.logo}
                  height={logo?.node?.mediaDetails?.height || 0}
                  src={logo?.node?.mediaItemUrl || ''}
                  width={logo?.node?.mediaDetails?.width || 0}
                />
              </LinkOrDiv>
            </li>
          ))}
        </ul>
      ) : (
        <p>No logos available.</p>
      )}
    </Container>
  );
}
