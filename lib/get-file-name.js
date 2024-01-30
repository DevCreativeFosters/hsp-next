export function getFileName(href) {
  if (!href) return '';

  const url = new URL(href);
  const { pathname } = url;
  return pathname.substring(pathname.lastIndexOf('/') + 1);
}
