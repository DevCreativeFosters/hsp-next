'use client';

import { useMemo, useState } from 'react';

import clsx from 'clsx';

import styles from './tabs.module.scss';

export default function Tabs({ tabs, type }) {
  const [activeTab, setActiveTab] = useState(tabs[0].slug);
  const [hasClicked, setHasClicked] = useState(false);

  const activeContent = useMemo(() => {
    const currentTab = tabs.find(tab => tab.slug === activeTab);
    return currentTab ? currentTab.content : null;
  }, [activeTab, tabs]);

  const handleTabClick = slug => {
    setActiveTab(slug);
    setHasClicked(true);
  };

  const handleMobileTileClick = () => {
    setHasClicked(false);
  };

  return (
    <section
      className={clsx(styles.accountContent, styles[type], {
        [styles.clickedState]: hasClicked,
      })}
    >
      <div className={styles.tabsMain}>
        <div className={styles.tabsNav}>
          {tabs.map(tab => (
            <button
              className={clsx(
                styles.tabButton,
                activeTab === tab.slug ? styles.active : '',
              )}
              key={tab.slug}
              onClick={() => handleTabClick(tab.slug)}
            >
              {tab.title}
            </button>
          ))}
        </div>

        <div className={styles.tabsContent}>
          <div className={styles.mobileTile} onClick={handleMobileTileClick}>
            Mobile Title
          </div>
          {activeContent}
        </div>
      </div>
    </section>
  );
}
