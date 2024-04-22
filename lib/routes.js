const routes = {
  australianMade: `/australian-made`,
  blog: slug => {
    if (slug) {
      return `/lifestyle/hsp-blog/${slug}`;
    }
    return `/lifestyle/hsp-blog`; // must match middleware config.matcher (pagination)
  },
  // Builder
  builder: '/builder',

  celebrities: slug => {
    if (slug) {
      return `/lifestyle/hsp-celebrities#${slug}`;
    }
    return '/lifestyle/hsp-celebrities';
  },

  error: `/error-404`,

  home: `/`,

  // Lifestyle
  lifestyle: `/lifestyle`,

  lifestyleVideoPreview: `/lifestyle?videoPreview=1`,

  privacyAndTerms: '/privacy-terms-and-conditions',

  product: (categorySlug, makeSlug, modelSlug, variantSlug) => {
    if (variantSlug) {
      return `/${categorySlug}/${makeSlug}/${modelSlug}/${variantSlug}`;
    } else if (modelSlug) {
      return `/${categorySlug}/${makeSlug}/${modelSlug}`;
    } else if (makeSlug) {
      return `/${categorySlug}/${makeSlug}`;
    } else if (categorySlug) {
      return `/${categorySlug}`;
    }
  },

  // Products
  products: `/products`,

  storeLocator: '/store-locator',

  // Support
  support: slug => {
    if (slug) {
      return `/support/${slug}`;
    }
    return `/support`;
  },

  tv: slug => {
    if (slug) {
      return `/lifestyle/hsp-tv/${slug}`;
    }
    return `/lifestyle/hsp-tv`; // must match middleware config.matcher (pagination)
  },

  uteBuilder: '/ute-builder',
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
