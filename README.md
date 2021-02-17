### simple-beats-npm

Simple beats is a simple and customisable NPM package that allows for the creation of indervidual 'metronomes'. You can you the built in oscillator or upload your own samples, change the speed and volume of the sample aswell as when they are played.

## Preperation

npm i simple-beats; 

const newMetronome = new Metronome(); 

# This will create the most basic version of a metronome and can be stopped and started as follows.

## Functionality

newBeat.start(); 

newBeat.stop(); 

# To upload your own samples use:

newBeat.loadSamples(['sample url']);

# You can assign the following values:

.BPM -> Number 

.noteVolumes -> Array //represents the volume to be played for each beat (max length is the .timeSigniture property).

.budge -> Number //push the notes on a track forward or backwards.

.noteLength -> Number //defines the length a note/sample is played.

.oscillatorType -> String //choose from sine, square, sawtooth, triangle.

.frequency -> //defines the frequencyy for the oscillator.

.gain -> Number(0-1) //the volume of a track, fills the noteVolumes array with that number.
