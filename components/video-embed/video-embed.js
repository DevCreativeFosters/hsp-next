import { convertToEmbedUrl } from '@lib/convert-video-embed-url';
import styles from './video-embed.module.scss';

export default function VideoEmbed({ videoUrl }) {
  if (videoUrl) {
    return (
      <div className={styles.embed}>
        <iframe
          src={convertToEmbedUrl(videoUrl)}
          frameborder="0"
          allowfullscreen
        />
      </div>
    );
  }

  return null;
}
