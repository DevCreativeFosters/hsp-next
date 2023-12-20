export default function shortcodeParser(shortcode) {
  if (!shortcode) return null;

  const regex = /\[([a-zA-Z_]+)\s+(.*?)\]/;
  const match = shortcode.match(regex);

  if (match) {
    const attributes = {};
    const name = match[1];
    const attributesString = match[2].trim();

    if (attributesString) {
      const attributesArray = attributesString.split(/\s+/);

      attributesArray.map(attributeString => {
        const [key, value] = attributeString.split('=');

        attributes[key] = value ? value.replace(/["']/g, '') : true;
      });
    }

    return {
      name,
      attributes,
    };
  }
}
