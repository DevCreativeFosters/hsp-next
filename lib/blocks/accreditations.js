import Accreditations from '@components/accreditations/accreditations';

export default function AccreditationsBlock(block) {
  return (
    <Accreditations
      title={block.title}
      description={block.text}
      certificates={block.certificates}
      group={block.membershipsGroup}
    />
  );
}
