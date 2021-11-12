const Join = require('./Sync.js');

module.exports = class SyncMapMap extends Join {

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    //
    //
    //
    //
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async sync() {

        for (const commonId in this.set1.set) {
            if (this.set2.set[commonId] === undefined) {
                if (this.includeOuterLeft) this.aggregator.onOuterLeft(commonId, this.set1.id(commonId), this.set1.item(commonId));
            } else {
                if (this.includeInner) this.aggregator.onInner(commonId, this.set1.id(commonId), this.set1.item(commonId), this.set2.id(commonId), this.set2.item(commonId));
            }
        }

        if (this.includeOuterRight)
            for (const commonId in this.set2.set)
                if (this.set1.set[commonId] === undefined)
                    this.aggregator.onOuterRight(commonId, this.set2.id(commonId), this.set2.item(commonId));
    }
}