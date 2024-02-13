import { convertToEmbedUrl } from '@lib/convert-video-embed-url';
import styles from './video-embed.module.scss';

export default function VideoEmbed({ videoUrl }) {
  const embedUrl = convertToEmbedUrl(videoUrl);

  if (embedUrl) {
    return (
      <div className={styles.embed}>
        <iframe src={embedUrl} frameBorder="0" allowFullScreen />
      </div>
    );
  }

  return null;
}
