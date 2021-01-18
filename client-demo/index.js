document.addEventListener('DOMContentLoaded', () => {
  const Metronome = getMetronome();
  console.log('metronome constructor', Metronome)
  const hihat =  new Metronome(200, 16);
  const bass = new Metronome(200, 8);
  const snare = new Metronome(200, 8);

  //URLs for samples
  const closedHiHatSampleFilePath = 'https://oramics.github.io/sampled/DRUMS/pearl-master-studio/samples/hihat-closed.wav';
  const openHiHatSampleFilePath = 'https://oramics.github.io/sampled/DRUMS/pearl-master-studio/samples/hihat-open.wav';
  const kickSampleFilePath = 'https://oramics.github.io/sampled/DRUMS/pearl-master-studio/samples/kick-01.wav';
  const snareSampleFilePath = 'https://oramics.github.io/sampled/DRUMS/pearl-master-studio/samples/snare-01.wav';

  hihat.loadSamples([closedHiHatSampleFilePath, openHiHatSampleFilePath]);
  hihat.gain = 0.5;
  hihat.noteVolumes = [0.2, 0.5];
  hihat.updateAccentChecked();
  //this is what out puts the timings for the visuals
  hihat.registerListener((val) => console.log(val));

  snare.loadSamples([snareSampleFilePath]);
  snare.noteVolumes = [0, 0, 1, 0, 0, 0, 1, 0];

  bass.loadSamples([kickSampleFilePath]);
  bass.noteVolumes = [1, 1, 0, 1, 0, 1, 0, 0]


  const playButton = document.getElementById('playButton');
  playButton.addEventListener('click', () => {
    hihat.start();
    bass.start();
    snare.start();
  })

});