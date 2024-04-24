'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import routes, { lifestyleRoutes } from '@lib/routes';

import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';

export default function BreadcrumbsLifestyle({
  className,
  exactBreadcrumb,
  initialContentTypeRoute,
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
        name: 'lifestyle',
        onSelect: value => {
          setContentTypeRoute(value);
          router.push(value);
        },
        options: lifestyleRoutes,
        selectedValue: contentTypeRoute,
        strong: true,
        type: 'select',
      };
  const breadcrumbs = [
    lifestyleBreadcrumb,
    contentTypeBreadcrumb,
    exactBreadcrumb,
  ].filter(Boolean);
  return <Breadcrumbs items={breadcrumbs} />;
}
