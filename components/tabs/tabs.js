'use client';

import { useMemo, useState } from 'react';

import clsx from 'clsx';

import styles from './tabs.module.scss';

export default function Tabs({ tabs, type }) {
  const [activeTab, setActiveTab] = useState(tabs[0].slug);

  // 🧠 Memoize the current tab content
  const activeContent = useMemo(() => {
    const currentTab = tabs.find(tab => tab.slug === activeTab);
    return currentTab ? currentTab.content : null;
  }, [activeTab, tabs]);

  return (
    <section className={clsx(styles.accountContent, styles[type])}>
      <div className={styles.tabsMain}>
        <div className={styles.tabsNav}>
          {tabs.map(tab => (
            <button
              className={clsx(
                styles.tabButton,
                activeTab === tab.slug ? styles.active : '',
              )}
              key={tab.slug}
              onClick={() => setActiveTab(tab.slug)}
            >
              {tab.title}
            </button>
          ))}
        </div>

        <div className={styles.tabsMain}>{activeContent}</div>
      </div>
    </section>
  );
}
