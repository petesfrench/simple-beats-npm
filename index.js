document.addEventListener('DOMContentLoaded', () => {
  const metronome = new Metronome(40, 4);
  metronome.updateAccentChecked();

  let playing = false;

  const playButton = document.getElementById('playButton');
  playButton.addEventListener('click', () => {
    if (playing) {
      metronome.stop()
      playButton.innerHTML = 'Play';
      playing = false;
    } else if (!playing) {
      metronome.start();
      playButton.innerHTML = 'Pause';
      playing = true
    }
  })
});