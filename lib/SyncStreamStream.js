const StepperStream = require('./StepperStream.js');
const Join = require('./Sync.js');

module.exports = class SyncStreamStream extends Join {

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    //
    //
    //
    //
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(options) {
        super(options);
        this.stepper1 = new StepperStream({ set: this.set1, key: this.key1 });
        this.stepper2 = new StepperStream({ set: this.set2, key: this.key2 });
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    //
    //
    //
    //
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    onOuterLeft() {
        if (this.includeOuterLeft) this.aggregator.onOuterLeft(this.stepper1.commonId, this.stepper1.id, this.stepper1.item);
        this.stepper1.progress();
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    //
    //
    //
    //
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    onOuterRight() {
        if (this.includeOuterRight) this.aggregator.onOuterRight(this.stepper2.commonId, this.stepper2.id, this.stepper2.item);
        this.stepper2.progress();
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    //
    //
    //
    //
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    onInner() {
        if (this.includeInner) this.aggregator.onInner(this.stepper1.commonId, this.stepper1.id, this.stepper1.item, this.stepper2.id, this.stepper2.item);
        this.stepper1.progress();
        this.stepper2.progress();
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    //
    //
    //
    //
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async sync() {
        this.stepper1.progress();
        this.stepper2.progress();

        while (!(this.stepper1.eof && this.stepper2.eof)) {
            if (this.stepper2.item === null) this.onOuterLeft();
            else if (this.stepper1.item === null) this.onOuterRight();
            else if (this.stepper1.id < this.stepper2.id) this.onOuterLeft();
            else if (this.stepper1.id > this.stepper2.id) this.onOuterRight();
            else this.onInner();
        }
    }
}