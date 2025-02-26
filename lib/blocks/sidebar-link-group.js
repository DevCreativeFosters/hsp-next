import LinksInGroups from '@components/links-in-groups/links-in-groups';

export default function SidebarLinkGroupBlock(block) {
  const group = [
    {
      links: block?.links,
      title: block?.title,
      titleTag: block?.titleTag,
      titleTagStyle: block?.titleTagStyle,
    },
  ];

  return <LinksInGroups groups={group || []} variant="sidebar" />;
}
