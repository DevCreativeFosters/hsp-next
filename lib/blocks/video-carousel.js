import routes from '@lib/routes';
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
      title={block.title}
      description={block.description}
      videos={block.hspCelebrityPosts}
      buttons={buttons}
      context="hsp-celebrities"
    />
  );
}
