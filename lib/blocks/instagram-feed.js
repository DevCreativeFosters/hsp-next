import InstagramFeed from '@components/instagram-feed/instagram-feed';

export default function InstagramFeedBlock(block) {
  return <InstagramFeed title={block.title} description={block.description} />;
}
