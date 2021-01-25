require("./AudioContext.mock");
const Metronome = require("./lib/metronome");

const tester = (metronome) => {
  console.log(metronome);
};

tester(new Metronome());
