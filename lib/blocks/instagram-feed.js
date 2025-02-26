import InstagramFeed from '@components/instagram-feed/instagram-feed';

export default function InstagramFeedBlock(block) {
  return (
    <InstagramFeed
      description={block.description}
      title={block.title}
      titleTag={block.titleTag}
      titleTagStyle={block.titleTagStyle}
    />
  );
}
