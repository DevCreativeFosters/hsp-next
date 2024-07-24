import FeaturePanels from '@components/feature-panels/feature-panels';

export default function FeaturePanelsBlock(block) {
  if (!block) return null;

  const title = block?.title;
  const panels = block?.panels;

  return <FeaturePanels panels={panels} title={title} />;
}
