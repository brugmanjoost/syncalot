const syncalot = require('../lib/index.js');
const StreamArray = require('./lib/StreamArray.js');
const data = require('./lib/datasets.js');
const { showResult } = require('./lib/output.js');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//
//
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
(async () => {

    showResult(
        `Demo #1.1: Synchronising two key/value maps with different types keys and ids.`,
        await syncalot.sync({
            set1: data.set1a,
            set2: data.set2a,
            key1: 'id',
            key2: (idx, item) => item.identifer.primaryKey - 100
        }).asMap());

    showResult(
        `Demo #1.2: Ignore the commonIds.`,
        await syncalot.sync({
            set1: data.set1a,
            set2: data.set2a,
            key1: 'id',
            key2: (idx, item) => item.identifer.primaryKey - 100
        }).asArray());

    showResult(
        `Demo #1.3: Just the commonIds.`,
        await syncalot.sync({
            set1: data.set1a,
            set2: data.set2a,
            key1: 'id',
            key2: (idx, item) => item.identifer.primaryKey - 100
        }).asArray({ commonIdsOnly: true }));

    showResult(
        `Demo #2.1: Using arrays.`,
        await syncalot.sync({
            set1: data.set1b,
            set2: data.set2b,
            key1: 'id',
            key2: (idx, item) => item.identifer.primaryKey - 100
        }).asMap());

    showResult(
        `Demo #2.2: Using arrays with just commonIds.`,
        await syncalot.sync({
            set1: data.set1c,
            set2: data.set2c,
        }).asArray({ commonIdsOnly: true }));

    showResult(
        `Demo #2.1: Using streams.`,
        await syncalot.sync({
            set1: new StreamArray(data.set1b),
            set2: new StreamArray(data.set2b),
            key1: 'id',
            key2: (idx, item) => item.identifer.primaryKey - 100
        }).asMap());

    showResult(`Demo #3.1: Getting results as events.`);
    let eventable = syncalot.sync({
        set1: data.set1a,
        set2: data.set2a,
        key1: 'id',
        key2: (idx, item) => item.identifer.primaryKey - 100
    }).asEventEmitter();
    eventable.on('outerleft', (idCommon, id1, item1) => {
        console.log('outerleft', idCommon, id1, item1);
    });
    eventable.on('outerright', (idCommon, id2, item2) => {
        console.log('outerright', idCommon, id2, item2);
    });
    eventable.on('inner', (idCommon, id1, item1, id2, item2) => {
        console.log('inner', idCommon, id1, item1, id2, item2);
    });
    await eventable.sync();

    showResult(`Demo #4.1: Getting results through callbacks.`);
    await syncalot.sync({
        set1: data.set1a,
        set2: data.set2a,
        key1: 'id',
        key2: (idx, item) => item.identifer.primaryKey - 100
    }).asCallbacks({
        onOuterLeft: (idCommon, id1, item1) => {
            console.log('outerleft', idCommon, id1, item1);
        },
        onOuterRight: (idCommon, id2, item2) => {
            console.log('outerright', idCommon, id2, item2);
        },
        onInner: (idCommon, id1, item1, id2, item2) => {
            console.log('inner', idCommon, id1, item1, id2, item2);
        }
    });

})();


