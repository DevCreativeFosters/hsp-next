export default function shortcodeParser(shortcode) {
  if (!shortcode) return null;

  const regex = /\[([a-zA-Z_]+)\s+(.*?)\]/;
  const match = shortcode.match(regex);

  if (match) {
    const attributes = {};
    const name = match[1];
    const attributesString = match[2].trim();

    if (attributesString) {
      attributesString
        .match(/[\w_-]+(?:=".*?"|(?=\s|$))/g)
        .forEach(function (attribute) {
          const match = attribute.match(/([\w_-]+)(?:="(.*?)")?/);
          if (match) {
            attributes[match[1]] = match[2] || true;
          }
        });
    }
    return {
      name,
      attributes,
    };
  }
}
