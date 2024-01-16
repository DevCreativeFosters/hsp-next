import GravityFormWrapper from '@components/gravity-forms/gravity-form-wrapper';
import Tooltip from '@components/tooltip/tooltip';
import shortcodeParser from '@lib/shortcode-parser';

export default function ShortcodeBlock(shortcode) {
  const parsedShortcode = shortcodeParser(shortcode);

  if (!parsedShortcode) return shortcode;

  switch (parsedShortcode.name) {
    case 'gravityform':
      return <GravityFormWrapper attributes={parsedShortcode.attributes} />;
    case 'tooltip':
      return <Tooltip attributes={parsedShortcode.attributes} />;
    default:
      return shortcode;
  }
}
