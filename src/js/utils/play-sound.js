const COINS_FALLING_SOUND = '/coins-falling.mp3';
const coinsFallingAudio = new Audio(COINS_FALLING_SOUND);

/**
 * @param {HTMLAudioElement} sound
 *  */
export function playSound(sound) {
  sound.pause();
  sound.currentTime = 0;
  sound.play();
}

export function playCoinsFallingSound() {
  playSound(coinsFallingAudio);
}
