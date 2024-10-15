import { Fragment } from 'react';

export default function TextElement({ className, text }) {
  const containsHTML = /<\/?[a-z][\s\S]*>/i.test(text);

  const lines = text.split('\r\n');
  const TextBrokenLines = lines.map((line, index) => (
    <Fragment key={index}>
      {line}
      {index < lines.length - 1 && <br />}
    </Fragment>
  ));

  const textNormalized = containsHTML ? (
    <div className={className} dangerouslySetInnerHTML={{ __html: text }} />
  ) : (
    <div className={className}>{TextBrokenLines}</div>
  );

  return textNormalized;
}
