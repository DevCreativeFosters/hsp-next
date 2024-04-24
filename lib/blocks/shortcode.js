import shortcodeParser from '@lib/shortcode-parser';

import GravityFormWrapper from '@components/gravity-forms/gravity-form-wrapper';
import Tooltip from '@components/tooltip/tooltip';

export default function ShortcodeBlock(shortcode) {
  const parsedShortcode = shortcodeParser(shortcode);

  if (!parsedShortcode) return shortcode;

  switch (parsedShortcode.name) {
    case 'gravityform':
      return (
        <GravityFormWrapper
          attributes={parsedShortcode.attributes}
          key={shortcode}
        />
      );
    case 'tooltip':
      return (
        <Tooltip attributes={parsedShortcode.attributes} key={shortcode} />
      );
    default:
      return shortcode;
  }
}
