import VideoBackgroundHero from '@components/video-background-hero/video-background-hero';

export default function VideoBackgroundHeroBlock(block) {
  return (
    <VideoBackgroundHero
      description={block.description}
      link={block.link}
      title={block.title}
      titleTag={block.titleTag}
      titleTagStyle={block.titleTagStyle}
      videoUrl={block.backgroundFile?.node?.mediaItemUrl}
    />
  );
}
