export default function normalizeTag(tag) {
  if (typeof tag === 'object') {
    return {
      name: tag.name,
      link: {
        url: tag.link?.url || tag.link,
      },
    };
  } else if (typeof tag === 'string') {
    return {
      name: tag,
      link: {
        url: `tag/${tag.toLowerCase()}`,
      },
    };
  }
  return null;
}
