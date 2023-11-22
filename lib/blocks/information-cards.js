import InformationCards from '@components/information-cards/information-cards';

export default function InformationCardsBlock(block) {
  return <InformationCards cards={block.cards} />;
}
