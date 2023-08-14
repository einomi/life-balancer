/**
 * @param {HTMLAudioElement} sound
 *  */
export function playSound(sound) {
  sound.pause();
  sound.currentTime = 0;
  sound.play();
}
