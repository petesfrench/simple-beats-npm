var chai = require('chai');
chai.use(require('chai-as-promised'));
chai.use(require('chai-string'));
chai.use(require('sinon-chai'));

require('sinon-as-promised')(Promise);

global.should = chai.should();
global.sinon = require('sinon');
