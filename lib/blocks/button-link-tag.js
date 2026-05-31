import ButtonLinkTag from '@components/button-link-tag/button-link-tag';

export default function ButtonLinkTagBlock(block) {
  return (
    <ButtonLinkTag
      buttonLink={block?.buttonLink}
      buttonText={block?.buttonText}
    />
  );
}
