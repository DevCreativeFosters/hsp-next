import styles from './video-embed.module.scss';

export default function VideoEmbed({ embed }) {
  const convertToEmbedUrl = videoUrl => {
    const youtubeRegExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const youtubeMatch = videoUrl.match(youtubeRegExp);

    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[2]}`;
    }

    const vimeoRegExp = /vimeo\.com\/(\d+)/;
    const vimeoMatch = videoUrl.match(vimeoRegExp);

    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    console.error('Invalid Video URL');
    return null;
  };

  const embedUrl = convertToEmbedUrl(embed);

  if (embed) {
    return (
      <div className={styles.embed}>
        <iframe src={embedUrl} frameborder="0" allowfullscreen></iframe>
      </div>
    );
  }

  return null;
}
