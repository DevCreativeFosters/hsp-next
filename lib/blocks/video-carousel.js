import VideoCarousel from '@components/video-carousel/video-carousel';

export default function VideoCarouselBlock(block) {
  const buttons = [
    {
      label: block.button?.title,
      link: block.button?.url,
      variant: 'primary',
    },
  ];

  return (
    <VideoCarousel
      buttons={buttons}
      context="hsp-celebrities"
      description={block.description}
      title={block.title}
      videos={block.hspCelebrityPosts?.nodes}
    />
  );
}
