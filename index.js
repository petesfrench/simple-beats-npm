document.addEventListener('DOMContentLoaded', () => {
  const metronome = new Metronome();
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



  const FrequencyInput = document.getElementById('FRQ_setter');
  const BPMInput = document.getElementById('BPM_setter');
  const NLInput = document.getElementById('NL_setter');

  BPMInput.addEventListener('change', (e) => {
    metronome.__BPM = e.target.value;
    console.log(metronome._BPM);
  })

  FrequencyInput.addEventListener('change', (e) => {
    metronome.frequency = e.target.value;
    console.log(metronome._frequency);
  })

  NLInput.addEventListener('change', (e) => {
    metronome.noteLength = e.target.value;
    console.log(metronome._noteLength);
  })
});