import Button from '@components/button';
import Container from '@components/container/container';
import FAQ from '@components/faq/faq';
import SectionIntro from '@components/section-intro/section-intro';
import { getGlobalOptions, getMenus, getPageData } from '@lib/api';
import Layout from '@components/layout/layout';
import { renderBlocks } from '@lib/block';
import { linkGroups } from '@mockup/support';
import styles from './page.module.scss';

export default async function SupportPage() {
  const globalOptions = await getGlobalOptions();
  const menus = await getMenus();
  const content = await getPageData('support');

  const title = 'Support';
  const description = `<p>Communication is key…<br/>In this page, you will find any relevant communications that may be relevant to our products.</p>`;

  return (
    <Layout
      title="HSP 4x4 - Support"
      menus={menus}
      globalOptions={globalOptions}
    >
      <section className={styles.section}>
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
      </section>

      {content?.map(block => {
        return renderBlocks(block);
      })}
    </Layout>
  );
}
