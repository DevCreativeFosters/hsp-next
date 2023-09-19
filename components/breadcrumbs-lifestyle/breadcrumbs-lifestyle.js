'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';
import routes, { lifestyleRoutes } from '@lib/routes';

export default function BreadcrumbsLifestyle({
  initialContentTypeRoute,
  exactBreadcrumb,
}) {
  const [contentTypeRoute, setContentTypeRoute] = useState(
    initialContentTypeRoute,
  );

  const router = useRouter();

  const lifestyleBreadcrumb = {
    label: 'Lifestyle',
    url: routes.lifestyle,
  };

  const contentTypeBreadcrumb = exactBreadcrumb
    ? {
        label: lifestyleRoutes.find(({ value }) => value === contentTypeRoute)
          ?.label,
        url: contentTypeRoute,
      }
    : {
        type: 'select',
        name: 'lifestyle',
        strong: true,
        selectedValue: contentTypeRoute,
        onSelect: value => {
          setContentTypeRoute(value);
          router.push(value);
        },
        options: lifestyleRoutes,
      };
  const breadcrumbs = [
    lifestyleBreadcrumb,
    contentTypeBreadcrumb,
    exactBreadcrumb,
  ].filter(Boolean);
  return <Breadcrumbs items={breadcrumbs} />;
}
