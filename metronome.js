const DEFAULT_LOOKAHEAD_MS = 25;
const DEFAULT_SCHEDULE_S = 0.1;
const DEFAULT_BPM = 90;
const DEFAULT_TIME_SIGNITURE = 16;
const DEFAULT_NOTE_LENGTH = 0.05;
const DEFAULT_OSCILLATOR_TYPE = "sine";
const DEFAULT_FREQUENCY = 220;
const MIN_FREQUENCY = 40;
const MINUTE = 15;
const DEFAULT_GAIN = 0;

const AudioContext = window.AudioContext || window.webkitAudioContext; //maybe change
const audioCtx = new AudioContext();

class Metronome {
  constructor(
    BPM = DEFAULT_BPM,
    timeSigniture = DEFAULT_TIME_SIGNITURE,
    gain = DEFAULT_GAIN
  ) {
    //User mutable
    this._BPM = BPM;
    this._timeSigniture = timeSigniture;
    this._gain = gain;
    this._pushNote = 0;
    this._noteVolumes = [1, 1, 1, 1];
    this._noteLength = DEFAULT_NOTE_LENGTH;
    this._oscillatorType = DEFAULT_OSCILLATOR_TYPE;
    this._frequency = DEFAULT_FREQUENCY;

    //Functionally assigned
    this._samplesArray = [];
    this._samplesLoaded = false;
    this._accentChecked = false;

    //Internal values
    this._notesInQueue = [];
    this._playing = false;
    this._timerID;
    this._nextNoteTime = 0.0;
    this._currentNote = 0;
    this._lookahead = DEFAULT_LOOKAHEAD_MS;
    this._scheduleAheadTime = DEFAULT_SCHEDULE_S;
  }

  //Client settings ----------------------------------------
  set BPM(newBPM = DEFAULT_BPM) {
    this._BPM = Number(newBPM);
  }

  set timeSigniture(newTimeSigniture = DEFAULT_TIME_SIGNATURE) {
    this._timeSigniture = Number(newTimeSigniture);
  }

  //array of num
  set noteVolumes(volumesArray) {
    if (volumesArray) this._noteVolumes = volumesArray;
    else console.error("No array of volumes has been passed.");
  }

  //can be negative
  set budge(time) {
    if (time) this._pushNote = time;
    else console.error("No time has been passed.");
  }

  //has to be positive.
  set noteLength(time) {
    if (time) this._noteLength = Number(time);
    else console.error("No time has been passed.");
  }

  set oscillatorType(wave = DEFAULT_OSCILLATOR_TYPE) {
    switch (wave) {
      case "sine":
      case "square":
      case "sawtooth":
      case "triangle":
        this._oscillatorType = wave;
        break;
      default:
        this._oscillatorType = DEFAULT_OSCILLATOR_TYPE;
    }
  }

  set frequency(freq = DEFAULT_FREQUENCY) {
    if (freq <= MIN_FREQUENCY) freq = MIN_FREQUENCY;
    this._frequency = freq;
  }

  set gain(gain = DEFAULT_GAIN) {
    this._noteVolumes = new Array(this._timeSigniture).fill(gain);
  }

  updateAccentChecked() {
    this._accentChecked ^= true;
  }

  _valueChecks() {
    while (this._noteVolumes.length < this._timeSigniture) {
      this._noteVolumes = [...this._noteVolumes, ...this._noteVolumes];
    }
  }

  start() {
    if (!this._playing) {
      this._currentNote = 0;
      this._nextNoteTime = audioCtx.currentTime;
      this._valueChecks();
      this._scheduler();
      this._playing = true;
    }
  }

  stop() {
    window.clearTimeout(this._timerID);
    this._playing = false;
  }

  _nextNote() {
    const secondsPerBeat = MINUTE / this._BPM;
    this._nextNoteTime += secondsPerBeat;
    this._currentNote++;
    if (this._currentNote >= this._timeSigniture) {
      this._currentNote = 0;
    }
  }

  _scheduleSamples(beatNumber, time) {
    if (beatNumber && time) {
      this._notesInQueue.push({ note: beatNumber, time: time });

      if (this._notesInQueue.length >= this._timeSigniture)
        this._notesInQueue.splice(0, 1);

      if (this._accentChecked && this._samplesArray.length >= 2) {
        if (beatNumber === this._timeSigniture - 1)
          this._playSample(
            audioCtx,
            this._samplesArray[1].audioBuffer,
            this._noteVolumes[beatNumber]
          );
        else
          this._playSample(
            audioCtx,
            this._samplesArray[0].audioBuffer,
            this._noteVolumes[beatNumber]
          );
      } else {
        this._playSample(
          audioCtx,
          this._samplesArray[0].audioBuffer,
          this._noteVolumes[beatNumber]
        );
      }
    } else console.error("No beatNumber or time provided.")
  }

  _scheduleOscillator(beatNumber, time) {
    this._notesInQueue.push({ note: beatNumber, time: time });

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.type = this._oscillatorType;

    if (this._noteVolumes[beatNumber] === 0) {
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    }
    if (this._accentChecked) {
      if (beatNumber === this._timeSigniture - 1)
        oscillator.frequency.value = this._frequency * 2;
      else oscillator.frequency.value = this._frequency;
    } else if (!this._accentChecked) {
      oscillator.frequency.value = this._frequency;
    }

    // if (this._noteVolumes[beatNumber] != 0) {
    oscillator.start(time + this._pushNote);
    oscillator.stop(time + this._noteLength + this._pushNote);
    // }
  }

  _scheduler() {
    let context;
    if (!context) context = this;

    function contextScheduler() {
      while (
        context._nextNoteTime <
        audioCtx.currentTime + context._scheduleAheadTime
      ) {
        if (context._samplesLoaded)
          context._scheduleSamples(context._currentNote, context._nextNoteTime);
        else
          context._scheduleOscillator(
            context._currentNote,
            context._nextNoteTime
          );
        context._nextNote();
      }
      context._timerID = window.setTimeout(
        contextScheduler,
        context._lookahead
      );
    }

    contextScheduler();
  }

  //Deal with custom samples

  loadSamples(urlArray) {
    this._setUpSample(urlArray).then((samples) => {
      this._samplesArray = [...samples];
      this._samplesLoaded = true;
    });
  }

  async _loadSound(audioCtxParam, filePath) {
    try {
      const response = await fetch(filePath);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioCtxParam.decodeAudioData(arrayBuffer);
      return audioBuffer;
    } catch (e) {
      console.log(e);
    }
  }

  //Array [str]
  async _setUpSample(urlArray) {
    if (urlArray) {
      return Promise.all(
        urlArray.map(async (path) => {
          let sampleHolder = {};
          sampleHolder.audioBuffer = await this._loadSound(audioCtx, path);
          sampleHolder.name = path
            .match(/([^\/]+)(?=\.\w+$)/)[0]
            .replace(/-/, "_");
          return sampleHolder;
        })
      ).then((data) => data);
    } else console.error("No path array had been provided");
  }

  _playSample(audioCtxParam, audioBuffer, noteVolume = 1) {
    if (audioCtxParam && audioBuffer) {
      const sampleSource = audioCtxParam.createBufferSource();
      const gainNode = audioCtx.createGain();
      sampleSource.buffer = audioBuffer;
      sampleSource.connect(gainNode);
      gainNode.connect(audioCtxParam.destination);
      gainNode.gain.value = noteVolume;
      sampleSource.start();
      return sampleSource;
    } else console.error("No Audio Parameters or Buffer had been provided");
  }
}

export default Metronome;
