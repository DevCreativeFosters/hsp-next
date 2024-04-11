import IntroAndCards from '@components/intro-and-cards/intro-and-cards';

export default function IntroAndCardsBlock(block) {
  return (
    <IntroAndCards
      cards={block.cards}
      description={block.description}
      title={block.title}
    />
  );
}
