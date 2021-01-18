document.addEventListener('DOMContentLoaded', () => {
  const Metronome = getMetronome();
  const hihat =  new Metronome(120, 16);
  const bass = new Metronome(120, 16);
  const snare = new Metronome(120, 16);

  //URLs for samples
  const closedHiHatSampleFilePath = 'https://oramics.github.io/sampled/DRUMS/pearl-master-studio/samples/hihat-closed.wav';
  const openHiHatSampleFilePath = 'https://oramics.github.io/sampled/DRUMS/pearl-master-studio/samples/hihat-open.wav';
  const kickSampleFilePath = 'https://oramics.github.io/sampled/DRUMS/pearl-master-studio/samples/kick-01.wav';
  const snareSampleFilePath = 'https://oramics.github.io/sampled/DRUMS/pearl-master-studio/samples/snare-01.wav';

  hihat.loadSamples([closedHiHatSampleFilePath, openHiHatSampleFilePath]);
  hihat.gain = 0.5;
  hihat.noteVolumes = [1, 0];
  hihat.updateAccentChecked();
  // hihat.registerListener((val) => console.log(val));
  console.log(hihat)
  snare.loadSamples([snareSampleFilePath]);
  snare.noteVolumes = [0, 0, 1, 0, 1, 0, 1, 1];

  bass.loadSamples([kickSampleFilePath]);
  bass.noteVolumes = [1, 1, 0, 1, 1, 0, 1, 0]


  const playButton = document.getElementById('playButton');
  playButton.addEventListener('click', () => {
    hihat.start();
    bass.start();
    snare.start();
    // metronome.start();
  })

});