const { Stream } = require('stream');
const SyncStreamStream = require('../SyncStreamStream.js');
const SyncStreamMap = require('../SyncStreamMap.js');
const SyncMapStream = require('../SyncMapStream.js');
const SyncMapMap = require('../SyncMapMap.js');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//
//
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let factories = {
    'streamstream': SyncStreamStream,
    'streammap': SyncStreamMap,
    'mapstream': SyncMapStream,
    'mapmap': SyncMapMap,
}

module.exports = (options) => {
    return factories[(options.set1 instanceof Stream ? 'stream' : 'map') + (options.set2 instanceof Stream ? 'stream' : 'map')];
}