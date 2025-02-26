import Container from '@components/container/container';
import Tiles from '@components/tiles/tiles';

export default function TilesBlock(block) {
  return (
    <Container>
      <Tiles
        buttons={block.buttons}
        description={block.description}
        tiles={block.tiles}
        title={block.title}
        titleTag={block.titleTag}
        titleTagStyle={block.titleTagStyle}
      />
    </Container>
  );
}
