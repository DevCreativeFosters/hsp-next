import Tiles from '@components/tiles/tiles';

export default function TilesBlock(block) {
  return (
    <Tiles
      buttons={block.buttons}
      description={block.description}
      tiles={block.tiles}
      title={block.title}
      titleTag={block.titleTag}
      titleTagStyle={block.titleTagStyle}
    />
  );
}
