import Container from '@components/container/container';
import Lifestyle from '@components/lifestyle/lifestyle';

export default function LifestyleBlock(block) {
  return (
    <Container>
      <Lifestyle
        title={block.title}
        description={block.description}
        buttons={block.buttons}
        featured={block.featuredPost}
        posts={block.posts || []}
      />
    </Container>
  );
}
