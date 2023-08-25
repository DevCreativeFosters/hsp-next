import Footer from "@components/footer/footer";

export default function Layout({menus, children, globalOptions}) {
  const footerMenus = {
    hsp: [],
    legal: [],
    lifestyle: [],
    products: [],
    resources: [],
    services: []
  }
  const footerText = globalOptions?.footerText;

  menus?.forEach(menu => {
    const menuLocation = menu?.node?.locations[0];
    const menuNodes = menu?.node?.menuItems.nodes

    switch (menuLocation) {
      case 'HSP_NAVIGATION':
        footerMenus.hsp.push(...menuNodes);
        break;
      case 'LEGAL_NAVIGATION':
        footerMenus.legal.push(...menuNodes);
        break;
      case 'LIFESTYLE_NAVIGATION':
        footerMenus.lifestyle.push(...menuNodes);
        break;
      case 'PRODUCTS_NAVIGATION':
        footerMenus.products.push(...menuNodes);
        break;
      case 'RESOURCES_NAVIGATION':
        footerMenus.resources.push(...menuNodes);
        break;
      case 'SERVICES_NAVIGATION':
        footerMenus.services.push(...menuNodes);
        break;
      default:
        break;
    }
  });

  return (
    <main>
      {children}
      <Footer menus={footerMenus} text={footerText}/>
    </main>
  )
}
