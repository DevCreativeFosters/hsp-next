import clsx from 'clsx';

import Button from '@components/button/button';
import SectionIntro from '@components/section-intro/section-intro';

import styles from './links-in-groups.module.scss';

export default function LinksInGroups({ description, groups, title, variant }) {
  const sectionClassNames = clsx(styles.section, {
    [styles.sidebar]: variant === 'sidebar',
  });

  return (
    <section className={sectionClassNames}>
      {title && description && (
        <SectionIntro description={description} fitInline title={title} />
      )}
      <div className={styles.groups}>
        {groups.map(({ links, title }, index) => (
          <div className={styles.group} key={index}>
            <h3 className={styles.title}>{title}</h3>
            {links.length > 0 && (
              <ul className={styles.list}>
                {links.map(({ link }, index) => {
                  if (link) {
                    const { title: label, url } = link;

                    return (
                      <li className={styles.listItem} key={index}>
                        <Button
                          className={styles.link}
                          href={url || ''}
                          rightIcon="arrow-forward"
                          variant="senary"
                        >
                          <span dangerouslySetInnerHTML={{ __html: label }} />
                        </Button>
                      </li>
                    );
                  }
                })}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
