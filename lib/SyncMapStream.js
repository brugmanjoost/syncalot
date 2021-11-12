const generateDynamicKey = require('./functions/generateDynamicKey.js');
const Join = require('./Sync.js');

module.exports = class SyncMapStream extends Join {

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    //
    //
    //
    //
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(options) {
        super(options);
        this.dynamicKey2 = generateDynamicKey(options.key2);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    //
    //
    //
    //
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async sync() {
        this.set1.deletionlistPrepare();

        let item2;
        let id2 = 0;
        while (null !== (item2 = this.set2.read())) {
            let commonId = this.dynamicKey2(id2++, item2);

            if (this.set1.set[commonId] === undefined) {
                if (this.includeOuterRight) this.aggregator.onOuterRight(commonId, id2, item2);
            } else {
                if (this.includeInner) this.aggregator.onInner(commonId, this.set1.id(commonId), this.set1.item(commonId), id2, item2);
                if (this.includeOuterLeft) delete this.set1.deletionList[commonId];
            }
        }

        if (this.includeOuterLeft)
            for (const commonId in this.set1.deletionList)
                this.aggregator.onOuterLeft(commonId, this.set1.id(commonId), this.set1.item(commonId));

    }
}