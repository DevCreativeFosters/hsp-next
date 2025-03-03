import ClickableLogos from '@components/clickable-logos/clickable-logos';

export default function ClickableLogosBlock(block) {
  if (!block) return null;

  return <ClickableLogos {...block} />;
}
