# [mocca][]

[![dependencies](https://david-dm.org/michaelcontento/mocca.svg)](https://david-dm.org/michaelcontento/mocca)
[![devDependencies](https://david-dm.org/michaelcontento/mocca/dev-status.svg)](https://david-dm.org/michaelcontento/mocca#info=devDependencies)

[![license](https://img.shields.io/npm/l/mocca.svg?style=flat-square)](https://www.npmjs.com/package/mocca)
[![npm version](https://img.shields.io/npm/v/mocca.svg?style=flat-square)](https://www.npmjs.com/package/mocca)
[![npm downloads](https://img.shields.io/npm/dm/mocca.svg?style=flat-square)](https://www.npmjs.com/package/mocca)

## Overview

It's quite cumbersome to install [mocha][], all awesome plugin you love and
call it with the right arguments...

... but [mocca][] is here to help you!

## Features

- A whole bunch of awesome plugins
    - [chai][]
    - [chai-as-promised][]
    - [chai-string][]
    - [mocha][]
    - [mocha-clean][]
    - [mocha-junit-reporter][]
    - [sinon][]
    - [sinon-as-promised][]
    - [sinon-chai][]
- Auto detects [babel][]
    - `npm install babel-core` and `babel-core/register` will be used as compiler
- Overwrite options from either `.mocha.opts` or `.moccarc`
- Creates a JUnit compliant `test-results.xml` on [TravisCI][] and [CircleCI][]
   - To be honest: It's based on the existance of the environment variable `CI`
- Detect test files based on the `__test__/someFile-test.js` naming scheme

## Installation

It's simple as:

    $ npm install --save-dev mocca

And running your tests is also pretty simple:

    $ ./node_modules/.bin/mocca

  [mocca]: https://github.com/michaelcontento/mocca
  [babel]: babeljs.io
  [TravisCI]: https://travis-ci.org/
  [CircleCI]: https://circleci.com/
  [chai]: https://www.npmjs.com/package/chai
  [chai-as-promised]: https://www.npmjs.com/package/chai-as-promised
  [chai-string]: https://www.npmjs.com/package/chai-string
  [mocha]: https://www.npmjs.com/package/mocha
  [mocha-clean]: https://www.npmjs.com/package/mocha-clean
  [mocha-junit-reporter]: https://www.npmjs.com/package/mocha-junit-reporter
  [sinon]: https://www.npmjs.com/package/sinon
  [sinon-as-promised]: https://www.npmjs.com/package/sinon-as-promised
  [sinon-chai]: https://www.npmjs.com/package/sinon-chai
