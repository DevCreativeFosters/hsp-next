import PromoImageText from '@components/promo-image-text/promo-image-text';

export default function PromoImageAndTextBlock(block) {
  return (
    <PromoImageText
      title={block.title}
      description={block.description}
      image={block.image}
    />
  );
}
