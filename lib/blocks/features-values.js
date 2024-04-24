import Container from '@components/container/container';
import Features from '@components/features/features';

export default function FeaturesValuesBlock(block) {
  if (!block) return null;

  return (
    <Container>
      <Features
        cta={{
          label: block.buttonLink?.title,
          url: block.buttonLink?.url,
        }}
        description={block.description}
        features={block.attributes}
        title={block.sectionTitle}
        video={{
          poster: block.videoThumbnailImage?.node?.sourceUrl,
          src: block.videoFile?.node?.mediaItemUrl,
          title: block.sectionTitle,
        }}
      />
    </Container>
  );
}
