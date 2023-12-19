'use client';

import { useCallback, useState, useRef } from 'react';
import AnimateHeight from 'react-animate-height';
import clsx from 'clsx';
import { getIcon } from '@lib/icons';
import SectionButtons from '@components/section-buttons/section-buttons';
import SectionIntro from '@components/section-intro/section-intro';
import Button from '@components/button/button';
import styles from './faq.module.scss';

export default function FAQ({ title, description, buttons, questions }) {
  const ExpandIcon = getIcon('expand-more-neutral');

  const [activeItemIndices, setActiveItemIndices] = useState([]);
  const [showAllItemsForMobile, setShowAllItemsForMobile] = useState(false);
  const listRef = useRef(null);

  const toggleItem = useCallback(
    n => {
      const contain = activeItemIndices.includes(n);
      const newIndices = contain
        ? activeItemIndices.filter(i => i !== n)
        : [...activeItemIndices, n].sort();
      setActiveItemIndices(newIndices);
    },
    [activeItemIndices],
  );
  const toggleShowAllItemsForMobile = useCallback(() => {
    setShowAllItemsForMobile(!showAllItemsForMobile);

    listRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, [showAllItemsForMobile]);

  const onKeyUp = useCallback(
    (ev, index) => {
      if (['Space', 'Enter'].includes(ev.code)) {
        toggleItem(index);
      }
    },
    [toggleItem],
  );

  return (
    <div className={styles.layout}>
      <div className={styles.intro}>
        <SectionIntro title={title} description={description} />
      </div>

      <div className={styles.buttonsContainer}>
        <SectionButtons buttons={buttons} alternatingLayout />
      </div>

      {questions.length > 0 && (
        <ul
          className={clsx(styles.list, {
            [styles.activeForMobile]: showAllItemsForMobile,
          })}
          ref={listRef}
        >
          {questions.map(({ question, answer }, index) => (
            <li
              key={index}
              className={clsx(styles.item, {
                [styles.active]: activeItemIndices.includes(index),
              })}
            >
              <div
                className={styles.question}
                onClick={() => toggleItem(index)}
                onKeyUp={ev => onKeyUp(ev, index)}
                role="button"
                tabIndex="0"
                aria-pressed={activeItemIndices.includes(index)}
              >
                <div className={styles.questionText}>{question}</div>
                <div className={styles.questionIndicator}>
                  <ExpandIcon />
                </div>
              </div>
              <AnimateHeight
                height={activeItemIndices.includes(index) ? 'auto' : 0}
                duration={300}
              >
                <div
                  className={styles.answer}
                  dangerouslySetInnerHTML={{ __html: answer }}
                />
              </AnimateHeight>
            </li>
          ))}
        </ul>
      )}
      <Button
        className={clsx(styles.buttonToggle, {
          [styles.isActive]: showAllItemsForMobile,
        })}
        onClick={toggleShowAllItemsForMobile}
        rightIcon={'arrow-forward'}
        variant="quinary"
        type="button"
      >
        {showAllItemsForMobile ? 'Show less' : 'Show more'}
      </Button>
    </div>
  );
}
