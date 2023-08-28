import Button from '@components/button';
import Container from '@components/container/container';
import SectionIntro from '@components/section-intro/section-intro';
import { getGlobalOptions, getMenus } from '@lib/api';
import Layout from '@components/layout/layout';
import { linkGroups } from '@mockup/support';
import styles from './page.module.scss';

export default async function SupportPage() {
  const globalOptions = await getGlobalOptions();
  const menus = await getMenus();

  const title = 'Support';
  const description = `<p>Communication is key…<br/>In this page, you will find any relevant communications that may be relevant to our products.</p>`;

  return (
    <Layout
      title="HSP 4x4 - Support"
      menus={menus}
      globalOptions={globalOptions}
    >
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

      <Container>
        <SectionIntro title={title} description={description} fitInline />
        <div className={styles.groups}>
          {linkGroups.map(({ title, links }, index) => (
            <div className={styles.group} key={index}>
              <h3 className={styles.title}>{title}</h3>
              {links.length > 0 && (
                <ul className={styles.list}>
                  {links.map(({ label, url }, index) => (
                    <li className={styles.listItem} key={index}>
                      <Button
                        href={url}
                        variant="senary"
                        rightIcon="arrow-forward"
                      >
                        {label}
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </Container>
    </Layout>
  );
}
