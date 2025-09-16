import { getLatestNumberOfHSPCelebritiesPosts } from '@lib/api/get-latest-number-of-HSP-celebrities-posts';
import { getLatestNumberOfHSPTVPosts } from '@lib/api/get-latest-number-of-HSPTV-posts';
import { getLatestNumberOfBlogPosts } from '@lib/api/get-latest-number-of-blog-posts';
import routes from '@lib/routes';

import PostsCarousel from '@components/posts-carousel/posts-carousel';
import PostsMasonry from '@components/posts-masonry/posts-masonry';
import VideoCarousel from '@components/video-carousel/video-carousel';

const renderBlogPosts = async block => {
  const posts = await getLatestNumberOfBlogPosts(block.numberOfPosts);

  const blogPosts = posts?.posts?.nodes?.map(post => {
    return {
      content: post.excerpt,
      createdAt: post.date,
      image: {
        altText: post.featuredImage?.node?.altText,
        mediaDetails: [],
        sourceUrl: post.featuredImage?.node?.sourceUrl,
      },
      tags: post.tags.nodes,
      title: post.title,
      titleTagType: post.lifestyleBlock.titleTagType[0],
      url: routes.blog(post.slug),
      variant: 'blog',
    };
  });

  return (
    <PostsMasonry
      button={block.viewAllButton}
      description={block.description}
      key={block.postType}
      posts={blogPosts}
      title={block.title}
      titleTag={block.titleTag}
      titleTagStyle={block.titleTagStyle}
    />
  );
};

const renderTVPosts = async block => {
  const posts = await getLatestNumberOfHSPTVPosts(block.numberOfPosts);

  const hspTvPosts = posts?.hspTvPosts?.nodes;

  const normalizedPosts = hspTvPosts?.map(post => {
    return {
      content: post.excerpt,
      createdAt: post.date,
      image: {
        altText: post.featuredImage?.node.altText,
        mediaDetails: [],
        sourceUrl: post.featuredImage?.node.sourceUrl,
      },
      tags: post.tags?.nodes,
      title: post.title,
      url: routes.tv(post.slug),
      variant: 'carousel',
    };
  });

  const button = {
    title: block.viewAllButton?.title,
    url: block.viewAllButton?.url,
    variant: 'primary',
  };

  return (
    <PostsCarousel
      button={button}
      description={block.description}
      key={block.title}
      posts={normalizedPosts}
      title={block.title}
      titleTag={block.titleTag}
      titleTagStyle={block.titleTagStyle}
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
      buttons={buttons}
      context="hsp-celebrities"
      description={block.description}
      title={block.title}
      titleTag={block.titleTag}
      titleTagStyle={block.titleTagStyle}
      videos={videos}
    />
  );
};

export default async function PostsCarouselBlock(block) {
  if (block.postType?.[0] === 'blog') {
    return await renderBlogPosts(block);
  } else if (block.postType?.[0] === 'hsp-tv') {
    return await renderTVPosts(block);
  } else if (block.postType?.[0] === 'hsp-celebrities') {
    return await renderCelebrityPosts(block);
  }
}
