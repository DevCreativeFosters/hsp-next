import ImageComponent from '@components/image-component';

export default function ImageBlock(block) {
  if (!block) return null;

  const desktopImage = block.desktopImage;
  const mobileImage = block.mobileImage;

  return (
    <ImageComponent desktopImage={desktopImage} mobileImage={mobileImage} />
  );
}
