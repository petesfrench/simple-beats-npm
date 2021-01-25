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


