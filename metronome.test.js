const fs = require("fs");
require("./AudioContext.mock");
const Metronome = require('./lib/metronome');


test("create instance of a metronome", () => {
  console.log(new Metronome());
});



