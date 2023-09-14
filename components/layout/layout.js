import Footer from '@components/footer/footer';
import Header from '@components/header/header';
import BgContinent from '@assets/images/bg-continent.png';
import Image from 'next/image';
import styles from './layout.module.scss';

export default function Layout({ menus, globalOptions, withMap, children }) {
  const footerMenus = {
    hsp: [],
    legal: [],
    lifestyle: [],
    products: [],
    resources: [],
    services: [],
  };
  const footerText = globalOptions?.footerText;

  menus?.forEach(menu => {
    const menuLocation = menu?.node?.locations[0];
    const menuNodes = menu?.node?.menuItems.nodes;

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
    <>
      <Header />
      <main className={styles.main}>
        {withMap && (
          <div className={styles.background}>
            <Image
              className={styles.backgroundImage}
              src={BgContinent}
              alt="Shape of Australia continent"
              fill={true}
              quality={80}
            />
          </div>
        )}
        <div className={styles.content}>{children}</div>
      </main>
      <Footer menus={footerMenus} text={footerText} />
    </>
  );
}
