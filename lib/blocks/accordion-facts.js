import AccordionFacts from '@components/accordion-facts/accordion-facts';

export default function AccordionFactsBlock(block) {
  if (!block) return null;

  const accordions = block?.accordionRow;
  const background = block?.background;

  return <AccordionFacts accordions={accordions} background={background} />;
}
