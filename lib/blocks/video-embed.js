import Container from '@components/container/container';
import VideoEmbed from '@components/video-embed/video-embed';

export default function VideoEmbedBlock(block) {
  return (
    <Container collapseMargin>
      <VideoEmbed videoUrl={block.embed} />
    </Container>
  );
}
