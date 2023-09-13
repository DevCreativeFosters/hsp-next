const routes = {
  home: `/`,
  australianMade: `/australian-made`,

  // Lifestyle
  lifestyle: `/lifestyle`,
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
  celebrities: `/lifestyle/hsp-celebrities`,

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
