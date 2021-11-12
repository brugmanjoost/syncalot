module.exports = class MapOriginal {
    constructor(set) {
        this.set = set;
    }

    item(commonId) {
        return this.set[commonId];
    }

    id(commonId) {
        return commonId;
    }

    deletionlistPrepare() {
        this.deletionList = {};
        for (const commonId in this.set) this.deletionList[commonId] = true;
    }
}
