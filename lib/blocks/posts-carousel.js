import { getLatestNumberOfHSPCelebritiesPosts } from '@lib/api/get-latest-number-of-HSP-celebrities-posts';
import { getLatestNumberOfHSPTVPosts } from '@lib/api/get-latest-number-of-HSPTV-posts';
import { getLatestNumberOfBlogPosts } from '@lib/api/get-latest-number-of-blog-posts';
import routes from '@lib/routes';
import PostsMasonry from '@components/posts-masonry/posts-masonry';
import PostsCarousel from '@components/posts-carousel/posts-carousel';
import VideoCarousel from '@components/video-carousel/video-carousel';

const renderBlogPosts = async block => {
  const posts = await getLatestNumberOfBlogPosts(block.numberOfPosts);

  const blogPosts = posts?.posts?.nodes?.map(post => {
    return {
      image: {
        sourceUrl: post.featuredImage?.node?.sourceUrl,
        altText: post.featuredImage?.node?.altText,
        mediaDetails: [],
      },
      title: post.title,
      content: post.excerpt,
      createdAt: post.date,
      url: routes.blog(post.slug),
      tags: post.tags.nodes,
      variant: 'blog',
    };
  });

  return (
    <PostsMasonry
      key={block.postType}
      title={block.title}
      description={block.description}
      button={block.viewAllButton}
      posts={blogPosts}
    />
  );
};

const renderTVPosts = async block => {
  const posts = await getLatestNumberOfHSPTVPosts(block.numberOfPosts);

  const hspTvPosts = posts?.hspTvPosts?.nodes;

  const normalizedPosts = hspTvPosts?.map(post => {
    return {
      image: {
        sourceUrl: post.featuredImage?.node.sourceUrl,
        altText: post.featuredImage?.node.altText,
        mediaDetails: [],
      },
      title: post.title,
      content: post.excerpt,
      createdAt: post.date,
      url: routes.tv(post.slug),
      tags: post.tags?.nodes,
      variant: 'carousel',
    };
  });

  const button = {
    title: block.viewAllButton?.title,
    variant: 'primary',
    url: block.viewAllButton?.url,
  };

  return (
    <PostsCarousel
      key={block.title}
      title={block.title}
      description={block.description}
      posts={normalizedPosts}
      button={button}
    />
  );
};

const renderCelebrityPosts = async block => {
  const posts = await getLatestNumberOfHSPCelebritiesPosts(block.numberOfPosts);

  const videos = posts?.celebrities?.nodes?.map(post => {
    return {
      ...post,
      url: routes.celebrities(post.slug),
    };
  });

  const buttons = [
    {
      label: block.viewAllButton?.title,
      link: block.viewAllButton?.url,
      variant: 'primary',
    },
  ];

  return (
    <VideoCarousel
      title={block.title}
      description={block.description}
      videos={videos}
      buttons={buttons}
      context="hsp-celebrities"
    />
  );
};

export default async function PostsCarouselBlock(block) {
  if (block.postType?.[0] === 'blog') {
    return renderBlogPosts(block);
  } else if (block.postType?.[0] === 'hsp-tv') {
    return renderTVPosts(block);
  } else if (block.postType?.[0] === 'hsp-celebrities') {
    return renderCelebrityPosts(block);
  }
}
