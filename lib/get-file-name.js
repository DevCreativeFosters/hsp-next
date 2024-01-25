export function getFileName(href) {
  if (href) {
    const url = new URL(href);
    const { pathname } = url;
    return pathname.substring(pathname.lastIndexOf('/') + 1);
  }
  return '';
}
