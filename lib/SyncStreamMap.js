const generateDynamicKey = require('./functions/generateDynamicKey.js');
const Join = require('./Sync.js');

module.exports = class SyncStreamMap extends Join {

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    //
    //
    //
    //
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(options) {
        super(options);
        this.dynamicKey1 = generateDynamicKey(options.key1);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    //
    //
    //
    //
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async sync() {

        let remainingKeys2 = {}
        if (this.includeOuterRight) for (const commonId in this.set2.set) remainingKeys2[commonId] = true;

        if (this.includeOuterRight) this.set2.deletionlistPrepare();

        let item1;
        let id1 = 0;
        while (null !== (item1 = this.set1.read())) {
            let commonId = this.dynamicKey1(id1++, item1);

            if (this.set2.set[commonId] === undefined) {
                if (this.includeOuterLeft) this.aggregator.onOuterLeft(commonId, id1, item1);
            } else {
                if (this.includeInner) this.aggregator.onInner(commonId, id1, item1, this.set2.id(commonId), this.set2.item(commonId));
                if (this.includeOuterRight) delete this.set2.deletionList[commonId];
            }
        }

        if (this.includeOuterRight)
            for (const commonId in this.set2.deletionList)
                this.aggregator.onOuterRight(commonId, this.set2.id(commonId), this.set2.item(commonId));

    }
}