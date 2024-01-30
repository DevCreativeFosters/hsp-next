import Container from '@components/container/container';
import FAQ from '@components/faq/faq';

export default function FAQBlock(block) {
  return (
    <Container>
      <FAQ
        title={block.title}
        description={block.description}
        buttons={block.buttons || []}
        questions={block.questions || []}
      />
    </Container>
  );
}
