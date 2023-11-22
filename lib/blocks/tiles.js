import Container from '@components/container/container';
import Tiles from '@components/tiles/tiles';

export default function TilesBlock(block) {
  return (
    <Container>
      <Tiles
        title={block.title}
        description={block.description}
        buttons={block.buttons}
        tiles={block.tiles}
      />
    </Container>
  );
}
