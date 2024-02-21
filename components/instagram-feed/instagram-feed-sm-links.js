import { getGlobalOptions } from '@lib/api';
import normalizeSocialMediaMenu from '@lib/normalize-social-media-menu';
import Button from '@components/button/button';

export default async function InstagramFeedSMLinks({ socialMenu }) {
  const globalOptions = await getGlobalOptions();
  const socialMedia = normalizeSocialMediaMenu(globalOptions);

  console.log(socialMedia);
  return (
    <nav>
      <ul>
        {socialMedia.map(({ url, iconPredefined, icon }, index) => (
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
    </nav>
  );
}
