import CategoriesAndProducts from '@components/categories-and-products/categories-and-products';

export default function CategoriesAndProductsBlock(block) {
  return <CategoriesAndProducts data={block.links} />;
}
