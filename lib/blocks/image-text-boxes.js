import ImageTextBoxes from '@components/image-text-boxes/image-text-boxes';

export default function ImageTextBoxesBlock(block) {
  if (!block) return null;

  const boxes = block?.boxes;

  return <ImageTextBoxes boxes={boxes} />;
}
