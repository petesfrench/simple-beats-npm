module.exports = function getMetronome () {

const DEFAULT_LOOKAHEAD_MS = 25;
const DEFAULT_SCHEDULE_S = 0.1;
const DEFAULT_BPM = 90;
const DEFAULT_TIME_SIGNITURE = 4;
const DEFAULT_NOTE_LENGTH = 0.05;
const DEFAULT_OSCILLATOR_TYPE = 'sine';
const DEFAULT_FREQUENCY = 220;
const MIN_FREQUENCY = 40;
const MINUTE = 60;
const DEFAULT_GAIN = 1;

const AudioContext = window.AudioContext || window.webkitAudioContext; //maybe change
const audioCtx = new AudioContext();

class Metronome {

  constructor(
    BPM = DEFAULT_BPM,
    timeSigniture = DEFAULT_TIME_SIGNITURE,
    gain = DEFAULT_GAIN) {

      //User mutable
    this._BPM = BPM;
    this._timeSigniture = timeSigniture;
    this._gain = gain;
    this._pushNote = 0;
    this._noteVolumes = [];
    this._noteLength = DEFAULT_NOTE_LENGTH;
    this._oscillatorType = DEFAULT_OSCILLATOR_TYPE;
    this._frequency = DEFAULT_FREQUENCY;

      //Functionally assigned
    this._samplesArray = [];
    this._samplesLoaded = false;
    this._accentChecked = false;


    this._notesInQueue = [];
    this._playing = false;
    this._timerID; //stores the setTimeout ID
    this._nextNoteTime = 0.0; //when the next note is due
    this._currentNote = 0;
    this._lookahead = DEFAULT_LOOKAHEAD_MS; //how often to schedule (in ms)
    this._scheduleAheadTime = DEFAULT_SCHEDULE_S; //how far ahead to shedule (in secs)

  };

  //Schedular settings

  //Client settings ----------------------------------------
  set BPM(newBPM) {
    this._BPM = Number(newBPM);
  }

  set timeSigniture(newTimeSigniture) {
    this._timeSigniture = Number(newTimeSigniture);
  }

  updateAccentChecked() {
    this._accentChecked ^= true;
  }

  set noteVolumes(volumesArray) {
    this._noteVolumes = volumesArray;
  }

  set budge(time) {
    this._pushNote = time;
  }

  set noteLength(time) {
    this._noteLength =  Number(time);
  }

  //Client Oscillator settings ---------------------------------
  set oscillatorType(wave) {
    let newWaveType;
    switch (wave) {
      case 'sine':
        newWaveType = 'sine';
        break;
      case 'square':
        newWaveType = 'square';
        break;
      case 'sawtooth':
        newWaveType = 'sawtooth';
        break;
      case 'triangle':
        newWaveType = 'triangle';
        break;
      default:
        newWaveType = DEFAULT_OSCILLATOR_TYPE;
    }
    this._oscillatorType = newWaveType;
  }

  //min frequency check not working...TODO
  set frequency(freq) {
    if (freq <= MIN_FREQUENCY) freq = MIN_FREQUENCY;
    this._frequency = freq;
  }

  //Sets volume - currently only mutes/unmutes.. TODO
  set gain(gain) {
    this._noteVolumes = new Array(this._timeSigniture).fill(1);
  }

  //Function to replace what I want setters to do....
  _valueChecks() {
    while (this._noteVolumes.length < this.timeSigniture) {
      this._noteVolumes = this._noteVolumes.push(...this._noteVolumes);
    }
  }

  //Starts the metronome -----------------------------------
  start() {
    if (!this._playing) {
      this._currentNote = 0;
      this._nextNoteTime = audioCtx.currentTime;
      this._valueChecks();
      this._scheduler();
      this._playing = true;
    } else {
      window.clearTimeout(this._timerID);
      this._playing = false;
    }
  }

  //Note scheduling operations ------------------------------
  _nextNote() {
    const secondsPerBeat = MINUTE / this._BPM;
    this._nextNoteTime += secondsPerBeat;
    this._currentNote++;
    if (this._currentNote >= this._timeSigniture /*|| this._currentNote >= this._noteVolumes.length*/) {
      this._currentNote = 0;
    }
  }

  // this allows output of the notesInQueue array
  aListener(val) {};
  //but calling instance.registerListener(()=>console.log(val))
  //you will recieve the value where ever you make this call
  //TODO: use to link up with graphics
  registerListener(listener) {
    this.aListener = listener;
  }

  _scheduleSamples(beatNumber, time) {

    this._notesInQueue.push({ note: beatNumber, time: time });
    this.aListener(this._notesInQueue)
    if (this._notesInQueue.length >= this._timeSigniture) this._notesInQueue.splice(0,1);

    if (this._accentChecked && this._samplesArray.length >= 2) {

      if (beatNumber === this._timeSigniture - 1) this._playSample(audioCtx, this._samplesArray[1].audioBuffer, this._noteVolumes[beatNumber]);

      else this._playSample(audioCtx, this._samplesArray[0].audioBuffer, this._noteVolumes[beatNumber]);

    } else {

      this._playSample(audioCtx, this._samplesArray[0].audioBuffer, this._noteVolumes[beatNumber]);

    }

  }

  _scheduleOscillator(beatNumber, time) {

    this._notesInQueue.push({ note: beatNumber, time: time });

    //Instantiate oscillator
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    //TODO REMOVE IF NOT NEEDED
    // if (this.mutedNotes.includes(beatNumber)) {
    //   gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    // } else {
    //   gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
    // }

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.type = this._oscillatorType;


    if (this._accentChecked) {

      if (beatNumber === this._timeSigniture - 1) oscillator.frequency.value = this._frequency * 2; //if first note play higher pitch noise

      else oscillator.frequency.value = this._frequency; //if not first note play medium pitch noise

    } else if (!this._accentChecked) {

      oscillator.frequency.value = this._frequency;

    }

    oscillator.start(time + this._pushNote);
    oscillator.stop(time + this._noteLength + this._pushNote);

  }

  //Calls the scheduling functions to run using setTimeout
  _scheduler() {

    let context;
    if (!context) context = this;

    function contextScheduler() {
      while (context._nextNoteTime < audioCtx.currentTime + context._scheduleAheadTime) {
        if (context._samplesLoaded) context._scheduleSamples(context._currentNote, context._nextNoteTime); //schedules future notes
        else context._scheduleOscillator(context._currentNote, context._nextNoteTime);
        context._nextNote(); //increments the 'pointer'
      }
      context._timerID = window.setTimeout(contextScheduler, context._lookahead);
    }

    contextScheduler()

  }

  //Deal with custom samples --------------------------------------------

  //Load custom samples (only from url)
  loadSamples(urlArray) {
    this._setUpSample(urlArray)
      .then(samples => {
        this._samplesArray = [...samples];
        this._samplesLoaded = true;
      })
  }

  //Fetch samples from URL, process and assign to a buffer
  async _loadSound(audioCtxParam, filePath) {
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer()
    const audioBuffer = await audioCtxParam.decodeAudioData(arrayBuffer);
    return audioBuffer;
  };


  //Map through array of samples and pass into _loadSound()
  async _setUpSample(urlArray) {
    return Promise.all(urlArray.map(async path => {
      let sampleHolder = {};
      sampleHolder.audioBuffer = await this._loadSound(audioCtx, path);
      sampleHolder.name = path.match(/([^\/]+)(?=\.\w+$)/)[0].replace(/-/, '_');
      return sampleHolder;
    }))
      .then(data => data); //why? I forget...
  };

  _playSample(audioCtxParam, audioBuffer, noteVolume = 1) {
    const sampleSource = audioCtxParam.createBufferSource();
    const gainNode = audioCtx.createGain();
    sampleSource.buffer = audioBuffer;
    sampleSource.connect(gainNode);
    gainNode.connect(audioCtxParam.destination);
    gainNode.gain.value = noteVolume;
    sampleSource.start();
    return sampleSource;
  }

}

return Metronome;
}