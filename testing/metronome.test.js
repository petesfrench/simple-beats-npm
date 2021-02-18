const fs = require("fs");	
require("./../AudioContext.mock");	
const Metronome = require('./../lib/metronome');	


describe("Setting up Metronome Enviroment", () => {
  test("Creating a new instance of a Metronome", () => {
    const newMetronome = new Metronome();
    expect(newMetronome._BPM).toEqual(90);
  });
});

describe("Testing the setter methods of a new Metronome Instance", () => {
  const newMetronome = new Metronome();

  test("Setting value for property: _BPM", () => {
    expect(newMetronome._BPM).toEqual(90);
    newMetronome.__BPM = 100;
    expect(newMetronome._BPM).toEqual(100);
  });
  test("Setting value for property: __timeSigniture", () => {
    expect(newMetronome._timeSigniture).toEqual(16);
    newMetronome.__timeSigniture = 4;
    expect(newMetronome._timeSigniture).toEqual(4);
  });
  test("Setting value for property: __noteVolumes", () => {
    expect(newMetronome._noteVolumes).toEqual([1, 1, 1, 1]);
    newMetronome.__noteVolumes = [0, 1, 0, 1];
    expect(newMetronome._noteVolumes).toEqual([0, 1, 0, 1]);
  });
  test("Setting value for property: _pushNote", () => {
    expect(newMetronome._pushNote).toEqual(0);
    newMetronome.budge = 1;
    expect(newMetronome._pushNote).toEqual(1);
  });

  test("Setting value for property: noteLength", () => {
    expect(newMetronome._noteLength).toEqual(0.05);
    newMetronome.noteLength = 0.01;
    expect(newMetronome._noteLength).toEqual(0.01);
  });
  test("Setting value for property: oscillatorType", () => {
    expect(newMetronome._oscillatorType).toEqual("sine");
    newMetronome.oscillatorType = "sawtooth";
    expect(newMetronome._oscillatorType).toEqual("sawtooth");
  });


  test("Setting value for property: frequency", () => {
    console.log(new Metronome());	    
    expect(newMetronome._frequency).toEqual(220);
    newMetronome.frequency = 140;
    expect(newMetronome._frequency).toEqual(140);
  });

  test("Setting value for property: __gain", () => {
    const instance = new Metronome();
    expect(instance._noteVolumes).toEqual([1, 1, 1, 1]);
    instance.__gain = 1;
    expect(instance._noteVolumes).toEqual([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
  });
});	



describe("Testing the playing and stopping state of the Metronome", () => {
  test("Should start playing", () => {
    const instance = new Metronome();
    console.log('hello',instance._playing);
    instance.start()
    console.log('hello',instance._playing);
  });


  test("Should Stop playing", () => {
    const newMetronome = new Metronome();
    newMetronome.stop();
    expect(newMetronome._playing).toEqual(false);
  });
});