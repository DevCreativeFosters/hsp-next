import Container from '@components/container/container';
import FAQ from '@components/faq/faq';

export default function FAQBlock(block) {
  return (
    <Container>
      <FAQ
        buttons={block.buttons || []}
        description={block.description}
        questions={block.questions || []}
        title={block.title}
        titleTag={block.titleTag}
        titleTagStyle={block.titleTagStyle}
      />
    </Container>
  );
}
