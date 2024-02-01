export function convertToEmbedUrl(videoUrl) {
  if (!videoUrl) {
    console.error('No video URL provided');
    return null;
  }

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

  console.error('Invalid video URL');

  return null;
}
