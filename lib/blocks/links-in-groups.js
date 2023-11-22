import Container from '@components/container/container';
import LinksInGroups from '@components/links-in-groups/links-in-groups';

export default function LinksInGroupsBlock(block) {
  return (
    <Container>
      <LinksInGroups
        title={block.title}
        description={block.description}
        groups={block.groups || []}
      />
    </Container>
  );
}
