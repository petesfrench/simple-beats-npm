document.addEventListener('DOMContentLoaded', () => {
  
describe('Setters', () => {
  const newMetronome = new Metronome();
  it('it should set value for property _BPM', () => {
    console.log('newMetronome -> ', newMetronome);
    console.log(newMetronome._BPM);
    newMetronome._BPM.should.eql(90);
    newMetronome.__BPM=100;
    newMetronome._BPM.should.eql(100);
   
  });
});
});


describe("Testing the playing and stopping state of the Metronome", () => {
  test("Should Start and Stop playing", () => {
    const newMetronome = new Metronome();
    newMetronome.start();
    expect(newMetronome._playing).toEqual(true);
    newMetronome.stop();
    expect(newMetronome._playing).toEqual(false);
  });
});

