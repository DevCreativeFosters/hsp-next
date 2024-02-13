import VideoBackgroundHero from '@components/video-background-hero/video-background-hero';

export default function VideoBackgroundHeroBlock(block) {
  return (
    <VideoBackgroundHero
      title={block.title}
      description={block.description}
      linkLabel={block.link?.title}
      videoUrl={block.backgroundFile?.mediaItemUrl}
    />
  );
}
