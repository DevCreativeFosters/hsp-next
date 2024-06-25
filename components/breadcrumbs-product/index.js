'use client';

import { usePathname } from 'next/navigation';

import routes from '@lib/routes';

import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';

export default function BreadcrumbsProduct({ currentProduct }) {
  const pathname = usePathname();

  const items = [
    {
      label: 'Products',
      url: routes.products,
    },
  ];

  if (currentProduct.mainCategory?.value) {
    items.push({
      label: currentProduct.mainCategory.label,
      url: routes.product(currentProduct.mainCategory.value),
    });
  }

  if (currentProduct.make?.value) {
    items.push({
      label: currentProduct.make.label,
      url: routes.product(
        currentProduct.mainCategory.value,
        currentProduct.make.value,
      ),
    });
  }

  if (currentProduct.model?.value) {
    items.push({
      label: currentProduct.model.label,
      strong: true,
      url: pathname,
    });
  }

  if (items.length > 0) {
    items[items.length - 1].strong = true;
  }

  return <Breadcrumbs items={items} />;
}
