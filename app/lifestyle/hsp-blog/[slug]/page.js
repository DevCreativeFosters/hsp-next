import { getBlogPost, getBlogPosts } from '@lib/api';
import Layout from '@components/layout/layout';
import { BlogPost } from '@components/blog-post';

const NUMBER_OF_RELATED_POSTS = 5;

export default async function BlogPostPage({ params }) {
  const post = await getBlogPost(params.slug);
  const title = post?.title;
  const content = post?.content;
  const excerpt = post?.excerpt;
  const image = post?.featuredImage?.node;
  const slug = post?.uri?.replaceAll('/', '');

  const relatedPosts = await getBlogPosts(NUMBER_OF_RELATED_POSTS);

  return (
    <Layout title={`HSP 4x4 - ${title}`}>
      <BlogPost
        title={title}
        content={content}
        excerpt={excerpt}
        image={image}
        slug={slug}
        relatedPosts={relatedPosts}
      />
    </Layout>
  );
}
