import Lifestyle from '@components/lifestyle/lifestyle';

export default function LifestyleBlock(block) {
  return (
    <Lifestyle
      buttons={block.buttons}
      description={block.description}
      featured={block.featuredPost?.nodes?.[0]}
      posts={block.posts?.nodes || []}
      title={block.title}
      titleTag={block.titleTag}
      titleTagStyle={block.titleTagStyle}
    />
  );
}
