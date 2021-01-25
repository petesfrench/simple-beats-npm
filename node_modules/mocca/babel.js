try {
    module.exports = require('babel-core/register');
} catch (e) {
    // Babel support is optional
}

try {
    require('babel-polyfill');
} catch (e) {
    // Babel-polyfill support is optional
}
