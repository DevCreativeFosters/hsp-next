import Button from '@components/button/button';

export default function InstagramFeedSMLinks({ socialMenu }) {
  return (
    <nav>
      <ul>
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
    </nav>
  );
}
