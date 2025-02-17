export const BRANCH = process.env.NEXT_PUBLIC_BRANCH;

export const WORDPRESS_API_URL =
  BRANCH === 'staging'
    ? process.env.NEXT_PUBLIC_WORDPRESS_API_URL_STAGING
    : process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
