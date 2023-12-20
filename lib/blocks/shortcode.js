import GravityForm from '@components/gravity-forms/gravity-form-provider';
import shortcodeParser from '@lib/shortcode-parser';

export default async function ShortcodeBlock(shortcode) {
  const parsedShortcode = shortcodeParser(shortcode);

  if (!parsedShortcode) return shortcode;

  switch (parsedShortcode.name) {
    case 'gravityform':
      return <GravityForm attributes={parsedShortcode.attributes} />;
    default:
      return shortcode;
  }
}
