import HeroProductRow from '@components/hero-product-row/hero-product-row';

export default function HeroProductRowBlock(block) {
  return (
    <HeroProductRow
      link={block.allProductsLink}
      products={block.products}
      title={block.title}
    />
  );
}
