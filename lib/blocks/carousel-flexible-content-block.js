import CarouselContentBlock from '@components/carousel-content-block/carousel-content-block';

export default function CarouselFlexibleContentBlock(block) {
  return (
    <CarouselContentBlock
      description={block.description}
      images={block.imageCarousel?.nodes || []}
      title={block.title}
    />
  );
}
