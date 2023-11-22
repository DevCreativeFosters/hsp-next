import HeroProductRow from '@components/hero-product-row/hero-product-row';

export default function HeroProductRowBlock(block) {
  return (
    <HeroProductRow
      title={block.title}
      products={block.products}
      link={block.allProductsLink}
    />
  );
}
