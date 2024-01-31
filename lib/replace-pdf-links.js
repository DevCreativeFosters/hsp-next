import { isPdf } from '@lib/file-types';
import { getFileName } from '@lib/get-file-name';

export default function replacePdfLinks(container) {
  if (container) {
    Array.from(container.querySelectorAll('a[href]'))?.map(link => {
      if (isPdf(link.href)) {
        const href = String(link.href);
        if (href) {
          link.removeAttribute('href');
          link.setAttribute('data-type', 'attachment');
          link.setAttribute('data-href', href);
          link.setAttribute('download', getFileName(href));
          link.setAttribute('target', '_blank');
        }
      }
    });
  }
}
