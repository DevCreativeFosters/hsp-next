import { Suspense } from 'react';

import { getAllPostsSlugs } from '@lib/api/get-all-posts-slugs';
import { getBlogPost } from '@lib/api/get-blog-post';
import { getRecentBlogPosts } from '@lib/api/get-recent-blog-posts';
import routes from '@lib/routes';

import { BlogPost } from '@components/blog-post';
import Layout from '@components/layout/layout';

const NUMBER_OF_RELATED_POSTS = 5;

export default async function BlogPostPage({ params }) {
  const post = await getBlogPost(params.slug);
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
  const posts = await getAllPostsSlugs();

  return (
    posts.map(post => ({
      slug: `${routes.lifestyleBlog}/${post.slug}`,
    })) || []
  );
}
