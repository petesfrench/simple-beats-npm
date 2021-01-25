"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var DEFAULT_LOOKAHEAD_MS = 25;
var DEFAULT_SCHEDULE_S = 0.1;
var DEFAULT_BPM = 90;
var DEFAULT_TIME_SIGNITURE = 16;
var DEFAULT_NOTE_LENGTH = 0.05;
var DEFAULT_OSCILLATOR_TYPE = "sine";
var DEFAULT_FREQUENCY = 220;
var MIN_FREQUENCY = 40;
var MINUTE = 15;
var DEFAULT_GAIN = 0;
var AudioContext = window.AudioContext || window.webkitAudioContext; //maybe change
var audioCtx = new AudioContext();
var Metronome = /** @class */ (function () {
    function Metronome(BPM, timeSigniture, gain) {
        if (BPM === void 0) { BPM = DEFAULT_BPM; }
        if (timeSigniture === void 0) { timeSigniture = DEFAULT_TIME_SIGNITURE; }
        if (gain === void 0) { gain = DEFAULT_GAIN; }
        this.BPM = BPM;
        this.timeSigniture = timeSigniture;
        this.gain = gain;
        //User mutable
        this._BPM = BPM;
        this._timeSigniture = timeSigniture;
        this._gain = gain;
        this._pushNote = 0;
        this._noteVolumes = [1, 1, 1, 1];
        this._noteLength = DEFAULT_NOTE_LENGTH;
        this._oscillatorType = DEFAULT_OSCILLATOR_TYPE;
        this._frequency = DEFAULT_FREQUENCY;
        //Functionally assigned
        this._samplesArray = [];
        this._samplesLoaded = false;
        this._accentChecked = false;
        //Internal values
        this._notesInQueue = [];
        this._playing = false;
        this._timerID;
        this._nextNoteTime = 0.0;
        this._currentNote = 0;
        this._lookahead = DEFAULT_LOOKAHEAD_MS;
        this._scheduleAheadTime = DEFAULT_SCHEDULE_S;
    }
    Object.defineProperty(Metronome.prototype, "__BPM", {
        set: function (newBPM) {
            this._BPM = Number(newBPM);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Metronome.prototype, "__timeSigniture", {
        set: function (newTimeSigniture) {
            this._timeSigniture = Number(newTimeSigniture);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Metronome.prototype, "__noteVolumes", {
        set: function (volumesArray) {
            this._noteVolumes = volumesArray;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Metronome.prototype, "budge", {
        set: function (time) {
            this._pushNote = time;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Metronome.prototype, "noteLength", {
        set: function (time) {
            this._noteLength = Number(time);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Metronome.prototype, "oscillatorType", {
        set: function (wave) {
            switch (wave) {
                case 'sine':
                case 'square':
                case 'sawtooth':
                case 'triangle':
                    this._oscillatorType = wave;
                    break;
                default:
                    this._oscillatorType = DEFAULT_OSCILLATOR_TYPE;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Metronome.prototype, "frequency", {
        set: function (freq) {
            if (freq <= MIN_FREQUENCY)
                this._frequency = MIN_FREQUENCY;
            this._frequency = freq;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Metronome.prototype, "__gain", {
        set: function (gain) {
            this._noteVolumes = new Array(this._timeSigniture).fill(gain);
        },
        enumerable: false,
        configurable: true
    });
    Metronome.prototype.updateAccentChecked = function () {
        this._accentChecked !== true;
    };
    Metronome.prototype._valueChecks = function () {
        while (this._noteVolumes.length < this._timeSigniture) {
            this._noteVolumes = __spreadArrays(this._noteVolumes, this._noteVolumes);
        }
    };
    Metronome.prototype.start = function () {
        if (!this._playing) {
            this._currentNote = 0;
            this._nextNoteTime = audioCtx.currentTime;
            this._valueChecks();
            this._scheduler();
            this._playing = true;
        }
    };
    Metronome.prototype.stop = function () {
        window.clearTimeout(this._timerID);
        this._playing = false;
    };
    Metronome.prototype._nextNote = function () {
        var secondsPerBeat = MINUTE / this._BPM;
        this._nextNoteTime += secondsPerBeat;
        this._currentNote++;
        if (this._currentNote >= this._timeSigniture) {
            this._currentNote = 0;
        }
    };
    Metronome.prototype._scheduleSamples = function (beatNumber, time) {
        var newNote = { note: beatNumber, time: time };
        this._notesInQueue.push(newNote);
        if (this._notesInQueue.length >= this._timeSigniture)
            this._notesInQueue.splice(0, 1);
        if (this._accentChecked && this._samplesArray.length >= 2) {
            if (beatNumber === this._timeSigniture - 1)
                this._playSample(audioCtx, this._samplesArray[1].audioBuffer, this._noteVolumes[beatNumber]);
            else
                this._playSample(audioCtx, this._samplesArray[0].audioBuffer, this._noteVolumes[beatNumber]);
        }
        else {
            this._playSample(audioCtx, this._samplesArray[0].audioBuffer, this._noteVolumes[beatNumber]);
        }
    };
    Metronome.prototype._scheduleOscillator = function (beatNumber, time) {
        var newNote = { note: beatNumber, time: time };
        this._notesInQueue.push(newNote);
        var oscillator = audioCtx.createOscillator();
        var gainNode = audioCtx.createGain();
        if (this._noteVolumes[beatNumber] === 0) {
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        }
        if (this._accentChecked) {
            if (beatNumber === this._timeSigniture - 1)
                oscillator.frequency.value = this._frequency * 2;
            else
                oscillator.frequency.value = this._frequency;
        }
        else if (!this._accentChecked) {
            oscillator.frequency.value = this._frequency;
        }
        oscillator.start(time + this._pushNote);
        oscillator.stop(time + this._noteLength + this._pushNote);
    };
    Metronome.prototype._scheduler = function () {
        var context;
        if (!context)
            context = this;
        function contextScheduler() {
            while (context._nextNoteTime <
                audioCtx.currentTime + context._scheduleAheadTime) {
                if (context._samplesLoaded)
                    context._scheduleSamples(context._currentNote, context._nextNoteTime);
                else
                    context._scheduleOscillator(context._currentNote, context._nextNoteTime);
                context._nextNote();
            }
            context._timerID = window.setTimeout(contextScheduler, context._lookahead);
        }
        contextScheduler();
    };
    Metronome.prototype.loadSamples = function (urlArray) {
        var _this = this;
        this._setUpSample(urlArray)
            .then(function (samples) {
            _this._samplesArray = __spreadArrays(samples);
            _this._samplesLoaded = true;
        });
    };
    Metronome.prototype._loadSound = function (audioCtxParam, filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var response, arrayBuffer, audioBuffer, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, fetch(filePath)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.arrayBuffer()];
                    case 2:
                        arrayBuffer = _a.sent();
                        return [4 /*yield*/, audioCtxParam.decodeAudioData(arrayBuffer)];
                    case 3:
                        audioBuffer = _a.sent();
                        return [2 /*return*/, audioBuffer];
                    case 4:
                        e_1 = _a.sent();
                        console.log(e_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ;
    Metronome.prototype._setUpSample = function (urlArray) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.all(urlArray.map(function (path) { return __awaiter(_this, void 0, void 0, function () {
                        var newSample, _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {
                                        name: path.match(/\/([^\/]+)\/?$/)[1].replace(/-/, '_')
                                    };
                                    return [4 /*yield*/, this._loadSound(audioCtx, path)];
                                case 1:
                                    newSample = (_a.audioBuffer = _b.sent(),
                                        _a);
                                    return [2 /*return*/, newSample];
                            }
                        });
                    }); }))];
            });
        });
    };
    ;
    Metronome.prototype._playSample = function (audioCtxParam, audioBuffer, noteVolume) {
        if (noteVolume === void 0) { noteVolume = 1; }
        var sampleSource = audioCtxParam.createBufferSource();
        var gainNode = audioCtx.createGain();
        sampleSource.buffer = audioBuffer;
        sampleSource.connect(gainNode);
        gainNode.connect(audioCtxParam.destination);
        gainNode.gain.value = noteVolume;
        sampleSource.start();
        return sampleSource;
    };
    return Metronome;
}());
exports.default = Metronome;
//# sourceMappingURL=metronome.js.map