export function trimSlash(slug) {
  return slug.split('/').filter(Boolean).join('');
}
