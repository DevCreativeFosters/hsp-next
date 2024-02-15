import VideoBackgroundHero from '@components/video-background-hero/video-background-hero';

export default function VideoBackgroundHeroBlock(block) {
  return (
    <VideoBackgroundHero
      title={block.title}
      description={block.description}
      link={block.link}
      videoUrl={block.backgroundFile?.node?.mediaItemUrl}
    />
  );
}
