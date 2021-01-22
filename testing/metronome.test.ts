import Metronome from "../metronome";

const metronome = require('../metronome');

test('create instance of a metronome', () => {
const metronome=new Metronome();
expect(metronome._BPM).toBe(90)
});