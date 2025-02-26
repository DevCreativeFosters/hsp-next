import Container from '@components/container/container';
import LinksInGroups from '@components/links-in-groups/links-in-groups';

export default function LinksInGroupsBlock(block) {
  return (
    <Container>
      <LinksInGroups
        description={block.description}
        groups={block.groups || []}
        title={block.title}
        titleTag={block.titleTag}
        titleTagStyle={block.titleTagStyle}
      />
    </Container>
  );
}
