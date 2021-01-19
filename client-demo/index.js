document.addEventListener('DOMContentLoaded', () => {
  const Metronome = getMetronome();
  const hihat =  new Metronome(120, 16);
  const bass = new Metronome(120, 16);
  const snare = new Metronome(120, 16);

  let playing = false;
  //URLs for samples
  const closedHiHatSampleFilePath = 'https://oramics.github.io/sampled/DRUMS/pearl-master-studio/samples/hihat-closed.wav';
  const openHiHatSampleFilePath = 'https://oramics.github.io/sampled/DRUMS/pearl-master-studio/samples/hihat-open.wav';
  const kickSampleFilePath = 'https://oramics.github.io/sampled/DRUMS/pearl-master-studio/samples/kick-01.wav';
  const snareSampleFilePath = 'https://oramics.github.io/sampled/DRUMS/pearl-master-studio/samples/snare-01.wav';

  hihat.loadSamples([closedHiHatSampleFilePath, openHiHatSampleFilePath]);
  hihat.gain = 0.5;
  hihat.noteVolumes = [1, 0];
  hihat.updateAccentChecked();
  hihat.registerListener((val1, val2, val3) => console.log(val1, val2, val3));
  snare.loadSamples([snareSampleFilePath]);
  snare.noteVolumes = [0, 0, 1, 0, 1, 0, 1, 1];

  bass.loadSamples([kickSampleFilePath]);
  bass.noteVolumes = [1, 1, 0, 1, 1, 0, 1, 0]


  const playButton = document.getElementById('playButton');
  playButton.addEventListener('click', () => {
    if (playing) {
      console.log('in start')
      hihat.stop();
      bass.stop();
      snare.stop();
      playing = false;
    } else if (!playing) {
      console.log('in stop')
      hihat.start();
      bass.start();
      snare.start();
      playing = true
    }
    // metronome.start();
  })

});