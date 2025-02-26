import FeaturePanels from '@components/feature-panels/feature-panels';

export default function FeaturePanelsBlock(block) {
  if (!block) return null;

  const title = block?.title;
  const titleTag = block?.titleTag;
  const titleTagStyle = block?.titleTagStyle;
  const alignment = block?.alignment;
  const panels = block?.panels;

  return (
    <FeaturePanels
      alignment={alignment}
      panels={panels}
      title={title}
      titleTag={titleTag}
      titleTagStyle={titleTagStyle}
    />
  );
}
