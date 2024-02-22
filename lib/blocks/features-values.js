import Container from '@components/container/container';
import Features from '@components/features/features';

export default function FeaturesValuesBlock(block) {
  if (!block) return null;

  return (
    <Container>
      <Features
        title={block.sectionTitle}
        description={block.description}
        cta={{
          label: block.buttonLink?.title,
          url: block.buttonLink?.url,
        }}
        video={{
          src: block.videoFile?.node?.mediaItemUrl,
          title: block.sectionTitle,
          poster: block.videoThumbnailImage?.node?.sourceUrl,
        }}
        features={block.attributes}
      />
    </Container>
  );
}
