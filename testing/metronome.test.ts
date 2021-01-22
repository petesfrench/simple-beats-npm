import Metronome from "../metronome";

require('jsdom-global')();
const fs = require('fs');
const options: object = {
    resources: 'useble', 
    runScripts: 'dangerously',
    url:'file://'+ __dirname
}
const html = fs.readFileSync(__dirname + '/../index.html', 'utf8');
require('jsdom-global')(html, options);

const metronome = require('../metronome');

test('create instance of a metronome', () => {
const metronome=new Metronome();
expect(metronome._BPM).toBe(90)
});