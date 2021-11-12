const generateSyncFactory = require('./functions/generateSyncFactory.js');
const generateMap = require('./functions/generateMap.js');
const getDefault = require('./functions/getDefault.js');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function internalSync(options, presets) {
    options = getDefault(options, {});
    Object.assign(options, presets);

    let factory = generateSyncFactory(options);
    options.set1 = generateMap(options.set1, options.key1);
    options.set2 = generateMap(options.set2, options.key2);

    return new (factory)(options);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = {
    sync: (options) => internalSync(options, {
        includeInner: true,
        includeOuterLeft: true,
        includeOuterRight: true
    }),
    inner: (options) => internalSync(options, {
        includeInner: true,
        includeOuterLeft: false,
        includeOuterRight: false
    }),
    outer: (options) => internalSync(options, {
        includeInner: false,
        includeOuterLeft: true,
        includeOuterRight: true
    }),
    outerLeft: (options) => internalSync(options, {
        includeInner: false,
        includeOuterLeft: true,
        includeOuterRight: false
    }),
    outerRight: (options) => internalSync(options, {
        includeInner: false,
        includeOuterLeft: false,
        includeOuterRight: true
    }),
    innerLeft: (options) => internalSync(options, {
        includeInner: true,
        includeOuterLeft: true,
        includeOuterRight: false
    }),
    innerRight: (options) => internalSync(options, {
        includeInner: true,
        includeOuterLeft: false,
        includeOuterRight: true
    }),
}
