import Accreditations from '@components/accreditations/accreditations';

export default function AccreditationsBlock(block) {
  return (
    <Accreditations
      certificates={block.certificates}
      description={block.text}
      group={block.membershipsGroup}
      title={block.title}
      titleTag={block.titleTag}
      titleTagStyle={block.titleTagStyle}
    />
  );
}
