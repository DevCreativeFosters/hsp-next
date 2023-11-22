import LinksInGroups from '@components/links-in-groups/links-in-groups';

export default function SidebarLinkGroupBlock(block) {
  const group = [
    {
      title: block?.title,
      links: block?.links,
    },
  ];

  return <LinksInGroups groups={group || []} variant="sidebar" />;
}
