import PromoImageText from '@components/promo-image-text/promo-image-text';

export default function PromoImageAndTextBlock(block) {
  return (
    <PromoImageText
      description={block.description}
      image={block.image?.node}
      title={block.title}
    />
  );
}
