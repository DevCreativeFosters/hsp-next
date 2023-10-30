import styles from './store-locator-suggestions.module.scss';

const MAX_SUGGESTIONS = 5;

export default function StoreLocatorSuggestions({
  items = [],
  selectLocation,
}) {
  if (!items.length > 0) {
    return null;
  }

  return (
    <div className={styles.suggestions}>
      <ul className={styles.suggestionList}>
        {items.slice(0, MAX_SUGGESTIONS).map((suggestion, index) => {
          const primaryText = suggestion.structured_formatting?.main_text;
          const secondaryText =
            suggestion.structured_formatting?.secondary_text;
          return (
            <li
              className={styles.suggestion}
              key={index}
              onClick={() => selectLocation(suggestion)}
            >
              {primaryText && <div className={styles.line1}>{primaryText}</div>}
              {secondaryText && (
                <div className={styles.line2}>{secondaryText}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
