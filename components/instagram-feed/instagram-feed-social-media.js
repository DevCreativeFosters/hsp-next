import Button from '@components/button/button';

import styles from './instagram-feed-social-media.module.scss';

export default function InstagramFeedSocialMedia({ socialMenu }) {
  return (
    <ul className={styles.socialMedia}>
      {socialMenu?.map(({ icon, iconPredefined, url }, index) => (
        <li key={url + index}>
          <Button
            background="dark"
            href={url || '#'}
            leftIcon={iconPredefined !== 'CUSTOM' ? iconPredefined : false}
            leftIconUrl={iconPredefined === 'CUSTOM' ? icon : false}
            size="small"
            target="_blank"
            variant="tertiary"
          />
        </li>
      ))}
    </ul>
  );
}
