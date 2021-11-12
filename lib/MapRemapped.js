module.exports = class MapRemapped {

    constructor(set, dynamicKey) {
        this.set = {}
        for (const id in set) {
            this.set[dynamicKey(id, set[id])] = {
                originalId: id,
                item: set[id]
            }
        }
    }

    item(commonId) {
        return this.set[commonId].item;
    }

    id(commonId) {
        return this.set[commonId].originalId;
    }

    deletionlistPrepare() {
        this.deletionList = this.set;
    }
}
