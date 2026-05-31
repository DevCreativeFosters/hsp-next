import ImageComponent from '@components/image-component';

export default function ImageBlock(block) {
  if (!block) return null;

  const desktopImage = block.desktopImage;
  const mobileImage = block.mobileImage;
  const link = block.link;

  return (
    <ImageComponent
      desktopImage={desktopImage}
      link={link}
      mobileImage={mobileImage}
    />
  );
}
