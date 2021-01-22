
const DEFAULT_LOOKAHEAD_MS: number = 25;
const DEFAULT_SCHEDULE_S: number = 0.1;
const DEFAULT_BPM: number = 90;
const DEFAULT_TIME_SIGNITURE: number = 16;
const DEFAULT_NOTE_LENGTH: number = 0.05;
const DEFAULT_OSCILLATOR_TYPE: OscillatorType = 'sine';
const DEFAULT_FREQUENCY: number = 220;
const MIN_FREQUENCY: number = 40;
const MINUTE: number = 15;
const DEFAULT_GAIN: number = 0;

const AudioContext: new () => AudioContext = window.AudioContext || window.webkitAudioContext; //maybe change
const audioCtx: AudioContext =  new AudioContext();

interface Note {
  note: number;
  time: number;
}
interface SampleHolder {
    name:string;
    audioBuffer: AudioBuffer;
}
class Metronome {

  public _BPM: number;
  public _timeSigniture: number;
  public _gain: number;
  public _pushNote: number;
  public _noteVolumes: Array<number>;
  public _noteLength: number;
  public _oscillatorType: OscillatorType;
  public _frequency: number;

  private _samplesArray: Array<SampleHolder>;
  private _samplesLoaded: boolean;
  private _accentChecked: boolean;
  private _notesInQueue: Array<Note>; 
  private _playing: boolean;
  private _timerID: any;
  private _nextNoteTime: number;
  private _currentNote: number;
  private _lookahead: number;
  private _scheduleAheadTime: number;

  constructor(public BPM = DEFAULT_BPM, public timeSigniture = DEFAULT_TIME_SIGNITURE, public gain = DEFAULT_GAIN) {
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

  set __BPM(newBPM: number) {
    this._BPM = Number(newBPM);
  }

  set __timeSigniture(newTimeSigniture: number) {
    this._timeSigniture = Number(newTimeSigniture);
  }

  set __noteVolumes(volumesArray: Array<number>) {
    this._noteVolumes = volumesArray;
  }

  set budge(time: number) {
    this._pushNote = time;
  }

  set noteLength(time: number) {
    this._noteLength = Number(time);
  }

  set oscillatorType(wave: string) {
    switch (wave) {
      case 'sine':
      case 'square':
      case 'sawtooth':
      case 'triangle':

        this._oscillatorType = wave;
        break;
      default:
        this._oscillatorType = DEFAULT_OSCILLATOR_TYPE;
    }
  }

  set frequency(freq: number) {

    if (freq <= MIN_FREQUENCY) freq = MIN_FREQUENCY;
    this._frequency = freq;
  }

  set __gain(gain: number) {
    this._noteVolumes = new Array(this._timeSigniture).fill(gain);
  }


  updateAccentChecked(): void {
    this._accentChecked !== true;
  }

  _valueChecks(): void {
    while (this._noteVolumes.length < this._timeSigniture) {
      this._noteVolumes = [...this._noteVolumes, ...this._noteVolumes];
    }
  }

  start(): void {
    if (!this._playing) {
      this._currentNote = 0;
      this._nextNoteTime = audioCtx.currentTime;
      this._valueChecks();
      this._scheduler();
      this._playing = true;
    }
  }

  stop(): void {
    window.clearTimeout(this._timerID);
    this._playing = false;
  }

  _nextNote(): void {
    const secondsPerBeat = MINUTE / this._BPM;
    this._nextNoteTime += secondsPerBeat;
    this._currentNote++;
    if (this._currentNote >= this._timeSigniture) {
      this._currentNote = 0;
    }
  }


  _scheduleSamples(beatNumber: number, time: number) {
    const newNote: Note = { note: beatNumber, time: time };

    this._notesInQueue.push(newNote);

    if (this._notesInQueue.length >= this._timeSigniture) this._notesInQueue.splice(0, 1);

    if (this._accentChecked && this._samplesArray.length >= 2) {
      if (beatNumber === this._timeSigniture - 1) this._playSample(audioCtx, this._samplesArray[1].audioBuffer, this._noteVolumes[beatNumber]);
      else this._playSample(audioCtx, this._samplesArray[0].audioBuffer, this._noteVolumes[beatNumber]);
    } else {
      this._playSample(audioCtx, this._samplesArray[0].audioBuffer, this._noteVolumes[beatNumber]);
    }

  }

  _scheduleOscillator (beatNumber: number, time: number) : void {

    const newNote: Note = { note: beatNumber, time: time };

    this._notesInQueue.push(newNote);

    const oscillator: OscillatorNode = audioCtx.createOscillator();
    const gainNode: GainNode = audioCtx.createGain();


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


    oscillator.start(time + this._pushNote);
    oscillator.stop(time + this._noteLength + this._pushNote);
  }

  _scheduler(): void {

    let context: Metronome;

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

  loadSamples(urlArray: Array<string>): void {
    this._setUpSample(urlArray)
      .then(samples => {
        this._samplesArray = [...samples];
        this._samplesLoaded = true;
      })
  }

  async _loadSound(audioCtxParam: BaseAudioContext, filePath: string): Promise<AudioBuffer> {
    try {
      const response = await fetch(filePath);
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await audioCtxParam.decodeAudioData(arrayBuffer);
      return audioBuffer;
    } catch (e) {
      console.log(e);
      
    }
  };
  async _setUpSample(urlArray: Array<string>): Promise<SampleHolder[]> {
    return Promise.all(urlArray.map(async path => {
      let newSample: SampleHolder = {
        name: path.match(/\/([^\/]+)\/?$/)[1].replace(/-/, '_'),
        audioBuffer: await this._loadSound(audioCtx, path)
      }
      return newSample;
    }));
  };

  _playSample(audioCtxParam: BaseAudioContext, audioBuffer: AudioBuffer, noteVolume: number = 1): AudioBufferSourceNode {
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

export default Metronome;
