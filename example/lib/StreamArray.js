const { Readable } = require('stream');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Class:       StreamArray
//
// Description: This is an example of a reader stream to be used as stream input for the join. In this particular case we stream the items in an
//              array.
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = class StreamArray extends Readable {

    constructor(array) {
        super({ objectMode: true });

        let position = 0;
        this.generator = (function* () {
            while (position < array.length) {
                yield array[position++];
            }
        })();
    }

    _read() {
        let chunk;
        while (!(chunk = this.generator.next()).done) {
            this.push(chunk.value);
        }
        this.push(null);
    }
}