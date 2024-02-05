import Container from '@components/container/container';
import TitleAndDescription from '@components/title-and-description/title-and-description';

export default function TitleAndDescriptionBlock(block) {
  return (
    <Container collapseMargin>
      <TitleAndDescription
        layoutVariant={block.layoutVariant}
        title={block.title}
        description={block.description}
      />
    </Container>
  );
}
