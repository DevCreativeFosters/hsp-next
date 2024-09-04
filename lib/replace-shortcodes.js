import ShortcodeBlock from '@lib/blocks/shortcode';

const SHORTCODE_REGEX = /\[[^\]]*]/g;

export const replaceShortcodes = text => {
  let lastIndex = 0;
  const components = [];

  text?.replace(SHORTCODE_REGEX, (match, offset) => {
    const betweenShortcodes = text.substring(lastIndex, offset);

    if (betweenShortcodes.trim()) {
      components.push(
        <div
          dangerouslySetInnerHTML={{ __html: betweenShortcodes }}
          key={offset}
        />,
      );
    }

    if (match) {
      components.push(ShortcodeBlock(match));
    }

    lastIndex = offset + match.length;

    return match;
  });

  const afterLastShortcode = text?.substring(lastIndex);

  if (afterLastShortcode?.trim()) {
    components.push(
      <div
        dangerouslySetInnerHTML={{ __html: afterLastShortcode }}
        key={lastIndex}
      />,
    );
  }

  return components.filter(Boolean);
};
