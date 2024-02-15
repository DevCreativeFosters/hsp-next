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
    return `/lifestyle/hsp-blog`; // must match middleware config.matcher (pagination)
  },
  tv: slug => {
    if (slug) {
      return `/lifestyle/hsp-tv/${slug}`;
    }
    return `/lifestyle/hsp-tv`; // must match middleware config.matcher (pagination)
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
  product: (categorySlug, makeSlug, modelSlug, variantSlug) => {
    if (variantSlug) {
      return `/products/${categorySlug}/${makeSlug}/${modelSlug}/${variantSlug}`;
    } else if (modelSlug) {
      return `/products/${categorySlug}/${makeSlug}/${modelSlug}`;
    } else if (makeSlug) {
      return `/products/${categorySlug}/${makeSlug}`;
    } else if (categorySlug) {
      return `/products/${categorySlug}`;
    }
  },

  // Builder
  builder: '/builder',

  privacyAndTerms: '/privacy-terms-and-conditions',
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
