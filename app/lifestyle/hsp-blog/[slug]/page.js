import { Suspense } from 'react';

import { draftMode } from 'next/headers';

import { getBlogPost } from '@lib/api/get-blog-post';
import { getRecentBlogPosts } from '@lib/api/get-recent-blog-posts';
import { getSeoByUri } from '@lib/api/get-seo-by-uri';
import { metadata } from '@lib/seo';

import { BlogPost } from '@components/blog-post';
import Layout from '@components/layout/layout';

const NUMBER_OF_RELATED_POSTS = 5;

export async function generateMetadata({ params }) {
  const tags = [
    `page:lifestyle/hsp-blog/${params.slug}`,
    `post:${params.slug}`,
  ];
  const data = await getSeoByUri(`${params.slug}`, tags);

  return {
    ...metadata,
    ...data,
  };
}

export default async function BlogPostPage({ params }) {
  const { isEnabled: isDraftEnabled } = draftMode();
  const post = await getBlogPost(params.slug, isDraftEnabled);
  const title = post?.title;
  const content = post?.content;
  const excerpt = post?.excerpt;
  const image = post?.featuredImage?.node;
  const slug = post?.uri?.replaceAll('/', '');

  const relatedPosts = await getRecentBlogPosts(NUMBER_OF_RELATED_POSTS);

  return (
    <Layout title={`HSP 4x4 - ${title}`}>
      <Suspense fallback={null}>
        <BlogPost
          content={content}
          excerpt={excerpt}
          image={image}
          relatedPosts={relatedPosts}
          slug={slug}
          title={title}
        />
      </Suspense>
    </Layout>
  );
}

export async function generateStaticParams() {
  return [];
}
