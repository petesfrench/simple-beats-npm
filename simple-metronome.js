module.exports = class Metronome  {

  constructor() {};
  //BPM setter
  BPM = 60;
  updateBPM(newBPM) {
    this.BPM = Number(newBPM);
  }

  //Time signiture setter
  timeSigniture = 4;
  updateTimeSigniture(newTimeSigniture) {
    this.timeSigniture = Number(newTimeSigniture);
  }

  //Handles whether accentCheckBox is selected
  accentChecked = false;
  updateAccentChecked() {
    this.accentChecked ^= true;
    // if (this.accentChecked) this.accentChecked = false;
    // else this.accentChecked = true;
  }

  //Schedular settings
  _lookahead = 25; //how often to schedule (in ms)
  _scheduleAheadTime = 0.1; //how far ahead to shedule (in secs)
  _currentNote = 0; //keeps track of current note so it knows when to loop
  _nextNoteTime = 0.0; //when the next note is due
  _timerID; //stores the setTimeout ID
  //Maybe deal with currently _playing differently?
  _playing = false;

  //Instantiate wedAudio Api
  AudioContext = window.AudioContext || window.webkitAudioContext; //maybe change
  audioCtx = new AudioContext();

  start () {
    if (!this._playing) {
      this._currentNote = 0;
      this._nextNoteTime = this.audioCtx.currentTime;
      this._scheduler();
      this._playing = true;
    } else {
      window.clearTimeout(this._timerID);
      this._playing = false;
    }
  }


  //Calculates time for next note & when to repeat the bar ex. every 4 beats
  _nextNote() {
    const secondsPerBeat = 60 / this.BPM;
    this._nextNoteTime += secondsPerBeat;
    this._currentNote++; //add beat
    if (this._currentNote >= this.timeSigniture) { //if full bar start over
      this._currentNote = 0;
    }
  }

  //Stores notes to be played & what notes to play when
  //TODO: allow for more dynamic input, perhaps using a config?
  notesInQueue = []; //store the scheduled notes
  _scheduleNote(beatNumber, time) {
    this.notesInQueue.push({note: beatNumber, time: time}); //pre-schedule the notes that need to be played and when

    //Instantiate oscillator
    const osc = this.audioCtx.createOscillator();
    osc.connect(this.audioCtx.destination);

    if (this.accentChecked) {

      if (beatNumber === 0) osc.frequency.value = 440.0; //if first note play higher pitch noise
      else osc.frequency.value = 220.0; //if not first note play medium pitch noise

    } else if (!this.accentChecked) {

      osc.frequency.value = 220.0;

    }

    osc.start(time);
    osc.stop(time + 0.05);
  }

  //Calls the scheduling functions to run using setTimeout
  _scheduler() {
    //while there are notes that will need to play before the next interval
    //schedue them and advance the 'pointer';
    let context;
    if (!context) context = this;

    function contextScheduler() {
      while (context._nextNoteTime < context.audioCtx.currentTime + context._scheduleAheadTime) {
        context._scheduleNote(context._currentNote, context._nextNoteTime); //schedules future notes
        context._nextNote(); //increments the 'pointer'
      }
      context._timerID = window.setTimeout(contextScheduler, context._lookahead);
    }

    //this.audiCtx.currentTime is logging a time outside of the while loop but not inside the
    //while loop...

    contextScheduler()

  }

}
