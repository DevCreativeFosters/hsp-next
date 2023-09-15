'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';
import routes, { lifestyleRoutes } from '@lib/routes';

export default function BreadcrumbsLifestyle({ initialRoute }) {
  const [currentRoute, setCurrentRoute] = useState(initialRoute);

  const router = useRouter();

  const breadcrumbs = [
    {
      label: 'Lifestyle',
      url: routes.lifestyle,
    },
    {
      type: 'select',
      name: 'lifestyle',
      selectedValue: currentRoute,
      onSelect: value => {
        setCurrentRoute(value);
        router.push(value);
      },
      options: lifestyleRoutes,
    },
  ];
  return <Breadcrumbs items={breadcrumbs} />;
}
