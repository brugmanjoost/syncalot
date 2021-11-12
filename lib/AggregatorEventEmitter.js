const getDefault = require('./functions/getDefault.js');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Class:       AggregatorEventEmitter
//
// Description: This class emits events for each detection by the synchroniser.
///
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = class AggregatorEventEmitter extends require('events') {

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // Function:    constructor
    //
    // Description: This aggregator emits events for each detection by the synchroniser.
    //
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(joiner, options) {
        super();
        this.sync = () => joiner.sync();
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // Function:    onOuterLeft
    //
    // Description: Called if an id exists in set1 but not in set2.
    //
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    onOuterLeft(commonId, id1, item1) {
        this.emit('outerleft', commonId, id1, item1);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // Function:    onOuterRight
    //
    // Description: Called if an id exists in set2 but not in set1.
    //
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    onOuterRight(commonId, id2, item2) {
        this.emit('outerright', commonId, id2, item2);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // Function:    onInner
    //
    // Description: Called if an id exists both sets.
    //
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    onInner(commonId, id1, item1, id2, item2) {
        this.emit('inner', commonId, id1, item1, id2, item2);
    }
}