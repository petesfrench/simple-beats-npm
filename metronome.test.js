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
      "https://oramics.github.io/sampled/DM/LM-2/samples/conga-hh.wav"
    ]);
    if (this._samplesLoaded === true)
      assert.equal(newMetronome.__samplesArray.length, 3);
  });
});

