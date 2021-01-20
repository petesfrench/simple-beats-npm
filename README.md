# simple-beats-npm

Simple beats is a simple and customisable NPM package that allows for the creation of indervidual 'metronomes'. You can you the built in oscillator or upload your own samples, change the speed and volume of the sample aswell as when they are played.

How to use:

npm i simple-beats; /n
const newBeat = new Metronome(); /n

This will create the most basic version of a metronome and can be stopped and started as follows:

newBeat.start(); /n
newBeat.stop(); /n

To upload your own samples use:

newBeat.loadSamples(['sample url']);

You can assign the following values:

.BPM -> Number /n
.noteVolumes -> Array //represents the volume to be played for each beat (max length is the .timeSigniture property). /n
.budge -> Number //push the notes on a track forward or backwards. /n 
.noteLength -> Number //defines the length a note/sample is played. /n 
.oscillatorType -> String //choose from sine, square, sawtooth, triangle /n
.frequency -> //defines the frequencyy for the oscillator /n
.gain -> Number(0-1) //the volume of a track, fills the noteVolumes array with that number. /n
