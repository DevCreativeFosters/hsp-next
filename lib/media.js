export function isVideoPlaying(videoEl) {
  return (
    videoEl.currentTime > 0 &&
    !videoEl.paused &&
    !videoEl.ended &&
    videoEl.readyState > 2
  );
}
