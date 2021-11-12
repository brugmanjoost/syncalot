const generateDynamicKey = require('./functions/generateDynamicKey.js');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Class:       StepperStream
//
// Description: Steps through objects in a stream.
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = class StepperStream {
    constructor(options) {
        this.set = options.set; // It's a stream
        this.key = options.key;
        this.dynamicKey = generateDynamicKey(options.key);
        this.item = null;
        this.id = -1;
        this.commonId = null;
        this.eof = false;
    }

    progress() {
        if (null === (this.item = this.set.read())) {
            this.eof = true;
            this.id = -1;
            this.commonId = null;
        }
        else
            this.id = this.dynamicKey(this.id++, this.item);
    }
}
