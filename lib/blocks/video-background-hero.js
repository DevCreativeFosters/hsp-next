import VideoBackgroundHero from '@components/video-background-hero/video-background-hero';

export default function VideoBackgroundHeroBlock(block) {
  return (
    <VideoBackgroundHero
      description={block.description}
      link={block.link}
      title={block.title}
      videoUrl={block.backgroundFile?.node?.mediaItemUrl}
    />
  );
}
