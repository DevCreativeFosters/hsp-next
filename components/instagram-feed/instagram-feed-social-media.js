import Button from '@components/button/button';
import styles from './instagram-feed-social-media.module.scss';

export default function InstagramFeedSocialMedia({ socialMenu }) {
  return (
    <ul className={styles.socialMedia}>
      {socialMenu?.map(({ url, iconPredefined, icon }, index) => (
        <li key={url + index}>
          <Button
            href={url}
            size="small"
            variant="tertiary"
            background="dark"
            leftIcon={iconPredefined !== 'CUSTOM' ? iconPredefined : false}
            leftIconUrl={iconPredefined === 'CUSTOM' ? icon : false}
          />
        </li>
      ))}
    </ul>
  );
}
