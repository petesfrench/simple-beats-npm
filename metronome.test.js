describe("Testing the playing and stopping state of the Metronome", () => {
  it("Should start playing", () => {
    const instance = new Metronome();
    instance.start();
    assert.equal(instance._playing, true);
  });

  it("Should Stop playing", () => {
    const newMetronome = new Metronome();
    newMetronome.stop();
    assert.equal(newMetronome._playing, false);
  });
});

describe("should have own methods as own properties", () => {
  beforeEach(() => {
    newMetronome = new Metronome();
  });
  it("Should have own property _notesInQueue", () => {
    expect(newMetronome).to.have.property("_notesInQueue");
  });
  it("Should have own property _accentChecked", () => {
    expect(newMetronome).to.have.property("_accentChecked");
  });
  it("Should have own property _playing", () => {
    expect(newMetronome).to.have.property("_playing");
  });
  it("Should have own property _nextNoteTime", () => {
    expect(newMetronome).to.have.property("_nextNoteTime");
  });
  it("Should have own property _audioCTX ", () => {
    expect(newMetronome).to.have.property("_audioCTX");
  });
  it("Should have own property _scheduleAheadTime", () => {
    console.log(newMetronome);
    expect(newMetronome).to.have.property("_scheduleAheadTime");
  });
});

describe("Testing the setter methods", () => {
  beforeEach(() => (newMetronome = new Metronome()));

  it("it should set value for property _BPM", () => {
    assert.equal(newMetronome._BPM, 90);
    newMetronome.__BPM = 100;
    assert.equal(newMetronome._BPM, 100);
  });

  it("Setting value for property: __timeSigniture", () => {
    assert.equal(newMetronome._timeSigniture, 16);
    newMetronome.__timeSigniture = 4;
    assert.equal(newMetronome._timeSigniture, 4);
  });

  it("Setting value for property: __noteVolumes", () => {
    assert.deepEqual([1, 1, 1, 1], newMetronome._noteVolumes);
    newMetronome.__noteVolumes = [0, 1, 0, 1];
    assert.deepEqual([0, 1, 0, 1], newMetronome._noteVolumes);
  });

  it("Setting value for property: _pushNote", () => {
    assert.equal(newMetronome._pushNote, 0);
    newMetronome.budge = 1;
    assert.equal(newMetronome._pushNote, 1);
  });

  it("Setting value for property: noteLength", () => {
    assert.equal(newMetronome._noteLength, 0.05);
    newMetronome.noteLength = 0.01;
    assert.equal(newMetronome._noteLength, 0.01);
  });

  it("Setting value for property: oscillatorType", () => {
    assert.equal(newMetronome._oscillatorType, "sine");
    newMetronome.oscillatorType = "sawtooth";
    assert.equal(newMetronome._oscillatorType, "sawtooth");
  });

  it("Setting value for property: frequency", () => {
    assert.equal(newMetronome._frequency, 220);
    newMetronome.frequency = 140;
    assert.equal(newMetronome._frequency, 140);
  });

  it("Setting value for property: __gain", () => {
    assert.deepEqual([1, 1, 1, 1], newMetronome._noteVolumes);
    newMetronome.__gain = 1;
    assert.deepEqual(
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      newMetronome._noteVolumes
    );
  });
});

describe("Sampling", () => {
  beforeEach(() => (newMetronome = new Metronome()));

  it("should be able to play a new sample", () => {
    newMetronome.loadSamples([
      "https://oramics.github.io/sampled/DM/LM-2/samples/cowb.wav",
    ]);
    if (this._samplesLoaded === true)
      assert.equal(newMetronome.__samplesArray.length, 1);
  });

  it("should be able to load multiple samples", () => {
    newMetronome.loadSamples([
      "https://oramics.github.io/sampled/DM/LM-2/samples/cowb.wav",
      "https://oramics.github.io/sampled/DM/LM-2/samples/conga-h.wav",
      "https://oramics.github.io/sampled/DM/LM-2/samples/conga-hh.wav",
    ]);
    if (this._samplesLoaded === true)
      assert.equal(newMetronome.__samplesArray.length, 3);
  });
});
describe("Testing the delay of the application", () => {
  beforeEach(() => (newMetronome = new Metronome()));
  let delay = 0;
  const MINUTE_IN_MS = 6000;
  const MINUTE_IN_S = 6;
  const acceptable_delay = 0.01;

  it("should Setup testing environment", (done) => {
    try {
      setTimeout(() => {
        console.log("Testing environment ~ready");
        done();
      }, 1000);
    } catch (error) {
      done(error);
    }
  }).timeout(10000);

  it("should have a delay inferior to 10ms when at 60 beats per minute", (done) => {
    newMetronome.__BPM = 60;
    newMetronome.start();

    setTimeout(() => {
      try {
        newMetronome.stop();
        delay = newMetronome._notesInQueue[newMetronome._BPM / 10].time - MINUTE_IN_S;
        assert.equal(delay < acceptable_delay, true);
        done();
      } catch (error) {
        return done(error);
      }
    }, MINUTE_IN_MS);
  }).timeout(10000);

  it("should have a delay inferior to 10ms when at 90 beats per minute", (done) => {
    newMetronome.__BPM = 90;
    newMetronome.start();

    setTimeout(() => {
      try {
        newMetronome.stop();
        delay =
          newMetronome._notesInQueue[newMetronome._BPM / 10].time - MINUTE_IN_S;
        assert.equal(delay < acceptable_delay, true);
        done();
      } catch (error) {
        return done(error);
      }
    }, MINUTE_IN_MS);
  }).timeout(10000);

  it("should have a delay inferior to 10ms when at 160 beats per minute", (done) => {
    newMetronome.__BPM = 160;
    console.log(newMetronome._notesInQueue);
    newMetronome.start();

    setTimeout(() => {
      try {
        newMetronome.stop();
        delay =
          newMetronome._notesInQueue[newMetronome._BPM / 10].time - MINUTE_IN_S;
        console.log(delay);
        assert.equal(delay < acceptable_delay, true);
        done();
      } catch (error) {
        return done(error);
      }
    }, MINUTE_IN_MS);
  }).timeout(10000);

  it("should have a delay inferior to 10ms when at 240 beats per minute", (done) => {
    newMetronome.__BPM = 240;
    newMetronome.start();

    setTimeout(() => {
      try {
        newMetronome.stop();
        delay =
          newMetronome._notesInQueue[newMetronome._BPM / 10].time - MINUTE_IN_S;
        assert.equal(delay < acceptable_delay, true);
        done();
      } catch (error) {
        return done(error);
      }
    }, MINUTE_IN_MS);
  }).timeout(10000);
});
