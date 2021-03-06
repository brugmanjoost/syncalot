const getDefault = require('./functions/getDefault.js');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Class:       AggregatorArray
//
// Description: This class compiles a list for each set of results from the synchroniser.
///
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = class AggregatorArray {

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // Function:    constructor
    //
    // Description: This aggregator produces an object containing three arrays each of which will contain a list of items.
    //
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(joiner, options) {
        this.options = getDefault(options, {});
        this.options.commonIdsOnly = getDefault(this.options.commonIdsOnly, false);
        this.result = {}
        if (joiner.includeOuterLeft) this.result.outerLeft = []
        if (joiner.includeInner) this.result.inner = []
        if (joiner.includeOuterRight) this.result.outerRight = []
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // Function:    onOuterLeft
    //
    // Description: Called if an id exists in set1 but not in set2.
    //
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    onOuterLeft(idCommon, id1, item1) {
        this.result.outerLeft.push(this.options.commonIdsOnly ? idCommon : {
            id1: id1,
            item1: item1,
        });
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // Function:    onOuterRight
    //
    // Description: Called if an id exists in set2 but not in set1.
    //
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    onOuterRight(idCommon, id2, item2) {
        this.result.outerRight.push(this.options.commonIdsOnly ? idCommon : {
            id2: id2,
            item2: item2
        });
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // Function:    onInner
    //
    // Description: Called if an id exists both sets.
    //
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    onInner(idCommon, id1, item1, id2, item2) {
        this.result.inner.push(this.options.commonIdsOnly ? idCommon : {
            id1: id1,
            item1: item1,
            id2: id2,
            item2: item2
        });
    }
}
