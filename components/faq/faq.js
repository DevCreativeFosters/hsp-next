'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import clsx from 'clsx';
import AnimateHeight from 'react-animate-height';

import { useIsMobile } from '@hooks/useIsMobile';

import { getIcon } from '@lib/icons';
import replacePdfLinks from '@lib/replace-pdf-links';

import Button from '@components/button/button';
import SectionButtons from '@components/section-buttons/section-buttons';
import SectionIntro from '@components/section-intro/section-intro';

import styles from './faq.module.scss';

export default function FAQ({
  buttons,
  description,
  questions,
  title,
  titleTag,
  titleTagStyle,
}) {
  const ExpandIcon = getIcon('expand-more-neutral');
  const isMobile = useIsMobile();

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

    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [showAllItemsForMobile]);

  const onKeyUp = useCallback(
    (ev, index) => {
      if (['Space', 'Enter'].includes(ev.code)) {
        toggleItem(index);
      }
    },
    [toggleItem],
  );

  useEffect(
    function replaceLinks() {
      replacePdfLinks(listRef.current);
    },
    [activeItemIndices],
  );

  return (
    <div className={styles.layout}>
      <div className={styles.intro}>
        <SectionIntro
          description={description}
          noMargin
          title={title}
          titleTag={titleTag}
          titleTagStyle={titleTagStyle}
        />

        <SectionButtons alwaysInColumn buttons={buttons} />
      </div>

      {questions.length > 0 && (
        <div className={styles.questions}>
          <ul
            className={clsx(styles.list, {
              [styles.activeForMobile]: showAllItemsForMobile,
            })}
            ref={listRef}
          >
            {questions.map(({ answer, question }, index) => (
              <li
                className={clsx(styles.item, {
                  [styles.active]: activeItemIndices.includes(index),
                })}
                key={index}
              >
                <div
                  aria-pressed={activeItemIndices.includes(index)}
                  className={clsx(styles.question, 'h5')}
                  onClick={() => toggleItem(index)}
                  onKeyUp={ev => onKeyUp(ev, index)}
                  role="button"
                  tabIndex="0"
                >
                  <div className={styles.questionText}>{question}</div>
                  <div className={styles.questionIndicator}>
                    <ExpandIcon />
                  </div>
                </div>
                <AnimateHeight
                  duration={300}
                  height={activeItemIndices.includes(index) ? 'auto' : 0}
                >
                  <div
                    className={clsx(styles.answer, 'p-medium')}
                    dangerouslySetInnerHTML={{ __html: answer }}
                  />
                </AnimateHeight>
              </li>
            ))}
          </ul>
          {(isMobile ? questions.length > 2 : questions.length > 6) && (
            <Button
              className={clsx(styles.buttonToggle, {
                [styles.isActive]: showAllItemsForMobile,
              })}
              onClick={toggleShowAllItemsForMobile}
              rightIcon={'arrow-forward'}
              type="button"
              variant="quinary"
            >
              {showAllItemsForMobile ? 'Show less' : 'Show more'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
