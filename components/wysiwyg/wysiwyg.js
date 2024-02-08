'use client';

import { useMemo } from 'react';
import clsx from 'clsx';
import { replaceShortcodes } from '@lib/replace-shortcodes';
import DownloadLinkWrapper from '@components/download-link-wrapper/download-link-wrapper';
import styles from './wysiwyg.module.scss';
import Accordion from '@components/accordion/accordion';
import AccordionItem from '@components/accordion/accordion-item';

function formatTinyMCETables(htmlString) {
  // Remove inline styles from table
  htmlString = htmlString.replace(/(<table[^>]*?)\s*style="[^"]*"/gi, '$1');

  // Remove inline styles from table cells
  htmlString = htmlString.replace(/(<(?:td|th)[^>]*?)\s*style="[^"]*"/gi, '$1');

  // Wrap tables in figure
  htmlString = htmlString.replace(/<table/gi, '<figure><table');
  htmlString = htmlString.replace(/<\/table>/gi, '</table></figure>');

  return htmlString;
}

export default function Wysiwyg({ className, content, accordions }) {
  const parsedContent = useMemo(() => replaceShortcodes(content), [content]);

  return (
    <DownloadLinkWrapper>
      <div className={clsx(styles.wysiwyg, className)}>
        {parsedContent}

        {accordions && accordions.length > 0 && (
          <Accordion>
            {accordions.map(
              (accordion, index) =>
                accordion.title && (
                  <AccordionItem key={index} triggerContent={accordion.title}>
                    {accordion.content && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: formatTinyMCETables(accordion.content),
                        }}
                      />
                    )}
                  </AccordionItem>
                ),
            )}
          </Accordion>
        )}
      </div>
    </DownloadLinkWrapper>
  );
}
