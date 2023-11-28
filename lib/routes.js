const routes = {
  home: `/`,
  australianMade: `/australian-made`,
  storeLocator: '/store-locator',
  error: `/error-404`,

  // Lifestyle
  lifestyle: `/lifestyle`,
  lifestyleVideoPreview: `/lifestyle?videoPreview=1`,
  blog: slug => {
    if (slug) {
      return `/lifestyle/hsp-blog/${slug}`;
    }
    return `/lifestyle/hsp-blog`;
  },
  tv: slug => {
    if (slug) {
      return `/lifestyle/hsp-tv/${slug}`;
    }
    return `/lifestyle/hsp-tv`;
  },
  celebrities: slug => {
    if (slug) {
      return `/lifestyle/hsp-celebrities#${slug}`;
    }
    return '/lifestyle/hsp-celebrities';
  },

  // Support
  support: slug => {
    if (slug) {
      return `/support/${slug}`;
    }
    return `/support`;
  },

  // Products
  products: `/products`,
  product: (type, make, model, variant) => {
    if (variant) {
      return `/products/${type}/${make}/${model}/${variant}`;
    } else if (model) {
      return `/products/${type}/${make}/${model}`;
    } else if (make) {
      return `/products/${type}/${make}`;
    } else if (type) {
      return `/products/${type}`;
    }
  },

  // Builder
  builder: '/builder',
};

export default routes;

export const lifestyleRoutes = [
  {
    label: 'HSP Blog',
    value: routes.blog(),
  },
  {
    label: 'HSP TV',
    value: routes.tv(),
  },
  {
    label: 'HSP Celebrities',
    value: routes.celebrities(),
  },
];
