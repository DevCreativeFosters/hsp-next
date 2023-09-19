import SectionIntro from '@components/section-intro/section-intro';
import Button from '@components/button/button';

import styles from './links-in-groups.module.scss';

export default function LinksInGroups({ title, description, groups }) {
  return (
    <section className={styles.section}>
      <SectionIntro title={title} description={description} fitInline />
      <div className={styles.groups}>
        {groups.map(({ title, links }, index) => (
          <div className={styles.group} key={index}>
            <h3 className={styles.title}>{title}</h3>
            {links.length > 0 && (
              <ul className={styles.list}>
                {links.map(({ link: { title: label, url, target } }, index) => (
                  <li className={styles.listItem} key={index}>
                    <Button
                      href={url}
                      variant="senary"
                      rightIcon="arrow-forward"
                    >
                      <span dangerouslySetInnerHTML={{ __html: label }} />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
