import clsx from 'clsx';
import VideoEl from '@components/video-reel/video-el';
import styles from './video-reel.module.scss';

export default function VideoReel({ items, currentIndex, setCurrentIndex }) {
  return (
    <div className={styles.track} data-current={currentIndex} id="video-reel">
      <span className={styles.placeholderFrontTile} />
      <span className={styles.placeholderFrontTile} />
      <span className={styles.placeholderFrontTile} />
      {items.map(({ title, slug, celebrityPostsCustomFields }, index) => (
        <div
          className={styles.tileContainer}
          key={index}
          onClick={() => setCurrentIndex(index)}
        >
          <div
            className={clsx(styles.tile, {
              [styles.isActive]: index === currentIndex,
            })}
          >
            <VideoEl
              index={index}
              title={title}
              isActive={index === currentIndex}
              thumbnail={celebrityPostsCustomFields?.thumbnail}
              video={celebrityPostsCustomFields?.video}
            />
            <h5 className={styles.title}>{title}</h5>
          </div>
        </div>
      ))}

      <span className={styles.placeholderEndTile} />
      <span className={styles.placeholderEndTile} />
      <span className={styles.placeholderEndTile} />
    </div>
  );
}
