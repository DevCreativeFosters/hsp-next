export default function normalizeTag(tag) {
  if (typeof tag === 'object') {
    return {
      link: {
        url: tag.link?.url || tag.link,
      },
      name: tag.name,
    };
  } else if (typeof tag === 'string') {
    return {
      link: {
        url: `tag/${tag.toLowerCase()}`,
      },
      name: tag,
    };
  }
  return null;
}
