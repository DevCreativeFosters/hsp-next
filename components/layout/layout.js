import LayoutClient from '/components/layout/layout-client';

export default async function Layout({ title, description, children }) {
  return <LayoutClient>{children}</LayoutClient>;
}
