import Button from '@components/button/button';
import styles from './instagram-feed-social-media.module.scss';

export default function InstagramFeedSocialMedia({ socialMenu }) {
  return (
    <ul className={styles.socialMedia}>
      {socialMenu?.map(({ url, iconPredefined, icon }, index) => (
        <li key={url + index}>
          <Button
            href={url || '#'}
            size="small"
            variant="tertiary"
            background="dark"
            leftIcon={
              iconPredefined[0] !== 'CUSTOM' ? iconPredefined[0] : false
            }
            leftIconUrl={iconPredefined[0] === 'CUSTOM' ? icon : false}
          />
        </li>
      ))}
    </ul>
  );
}
