import TextAndVideoPromo from '@components/text-and-video-promo/text-and-video-promo';

export default function TextAndVideoPromoBlock(block) {
  return (
    <TextAndVideoPromo
      title={block.title}
      description={block.description}
      videoUrl={block.videoUrl}
      linkText={block.learnMoreButton?.title}
      linkUrl={block.learnMoreButton?.url}
    />
  );
}
