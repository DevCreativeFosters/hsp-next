const routes = {
  home: `/`,
  australianMade: `/australian-made`,

  // Lifestyle
  lifestyle: `/lifestyle`,
  blog: blogPostSlug => {
    if (blogPostSlug) {
      return `/lifestyle/hsp-blog/${blogPostSlug}`;
    }
    return `/lifestyle/hsp-blog`;
  },
  tv: tvPostSlug => {
    if (tvPostSlug) {
      return `/lifestyle/hsp-tv/${tvPostSlug}`;
    }
    return `/lifestyle/hsp-tv`;
  },
  celebrities: `/lifestyle/hsp-celebrities`,

  // Support
  support: supportSubpageSlug => {
    if (supportSubpageSlug) {
      return `/support/${supportSubpageSlug}`;
    }
    return `/support`;
  },

  // Products
  products: `/products`,
  product: (type, maker, model, variant) => {
    if (variant) {
      return `/products/${type}/${maker}/${model}/${variant}`;
    } else if (model) {
      return `/products/${type}/${maker}/${model}`;
    } else if (maker) {
      return `/products/${type}/${maker}`;
    } else if (type) {
      return `/products/${type}`;
    }
  },

  // Builder
  builder: '/builder',
};

export default routes;
