import IntroAndCards from '@components/intro-and-cards/intro-and-cards';

export default function IntroAndCardsBlock(block) {
  return (
    <IntroAndCards
      title={block.title}
      description={block.description}
      cards={block.cards}
    />
  );
}
