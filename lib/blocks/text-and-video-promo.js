import TextAndVideoPromo from '@components/text-and-video-promo/text-and-video-promo';

export default function TextAndVideoPromoBlock(block) {
  return (
    <TextAndVideoPromo
      description={block.description}
      linkText={block.learnMoreButton?.title}
      linkUrl={block.learnMoreButton?.url}
      title={block.title}
      titleTag={block.titleTag}
      titleTagStyle={block.titleTagStyle}
      videoUrl={block.videoFile?.node?.mediaItemUrl}
    />
  );
}
