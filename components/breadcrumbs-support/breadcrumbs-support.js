'use client';

import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';
import routes from '@lib/routes';

export default function BreadcrumbsSupport({ exactBreadcrumb }) {
  const supportBreadcrumb = {
    label: 'Support',
    url: routes.support(''),
  };

  const breadcrumbs = [supportBreadcrumb, exactBreadcrumb].filter(Boolean);
  return <Breadcrumbs items={breadcrumbs} />;
}
