document.addEventListener('DOMContentLoaded', () => {
  const Metronome = getMetronome();
  const metronome = new Metronome(40, 4);
  metronome.updateAccentChecked();

  let playing = false;

  const playButton = document.getElementById('playButton');
  playButton.addEventListener('click', () => {
    if (playing) {
      metronome.stop()
      playing = false;
    } else if (!playing) {
      metronome.start()
      playing = true
    }
  })
});