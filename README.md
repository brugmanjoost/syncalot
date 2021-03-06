# syncalot
Syncalot is a nodejs module used to synchronise datasets. Syncalot easily compares arrays, key/value maps and streams with eachother to identify items that exist in either side 
or in both. Syncalot has zero external dependencies.

1. [Installation](##1)
2. [What you need to know](##2)
3. [Examples](##3)<br />
3.1 [Synchronising two key/value maps with different types keys and ids](##3.1)<br />
3.2 [Using arrays](##3.2)<br />
3.3 [Using streams](##3.3)<br />
3.4 [Receiving results through events](##3.4)<br />
3.5 [Receiving results through callbacks](##3.5)<br />
3.6 [Selective sync](##3.6)<br />
4. [Internals](##4)<br />
4.1 [Preparation](##4.1)<br />
4.2 [Actual sync](##4.2)<br />
4.2 [Results](##4.3)<br />

<a name="#1"></a>
## 1. Installation

```sh
$ npm install syncalot
```
<a name="#2"></a>
## 2. What you need to know
Syncalot always compares two sets: **set1** on the left and **set2** on the right. Each item in each set is assumed to have an **id** that uniquely identifies the item within that set. On top of that you specifiy a **key** to dynamically determine the **commonId** for each **item** in the **set** and perform the synchronisation. If a **commonId** exists in set1 but not in set2, the item from set1 is outputted as **outerLeft**. If a commonId exists in set2 but not in set1, the item from set2 is outputted as **outerRight**. If the commonId exists in both sets then the item is outputted as **inner**.

A key is any one of these three things:
- The name of the item's property: The property value will be used as the commonId.
- A function **(id, item) => { return &lt;your-calculated common-id&gt;; }**: Called for each item the function returns a calculated commonId.
- Undefined: See below
  
**For arrays:** The id for an item is always the index in the array. An unspecified key yields the entry in the array as the commonId.

**For key/value maps:** The id for an item is always the key in the map. An unspecified key yields the key in the map as the commonId.

**For streams:** The id for an item is always the index of the item as it came through the stream. A key is mandatory.

<a name="#3"></a>
# 3. Examples
You can find an extensive list of samples in /examples. Following is a subset of those examples.

<a name="#3.1"></a>
## 3.1 Synchronising two key/value maps with different types keys and ids
Consider the following scenario with two key/valyue maps set1 and set2. Both sets contain user details but the data came from different databases. As a result the map keys do not line up. In set1 Susan is located under key f0b91a30. In set2 Susan is located under key 5dff2eef. The objects also do have an underlying id but they too are in different formats. In set1 each user can be identified through the id property. In set2 a similar property is located under identifier.userId but the ids are different so that an id in set1 + 100 equals the userId in set 2:

```
let set1a = {
    "4573cb2a": { id: 1, name: 'Johnny' },
    "f0b91a30": { id: 2, name: 'Susan' }
}
let set2a = {
    "5dff2eef": { identifer: { userId: 102 }, name: 'Susan Brooks' },
    "bf336645": { identifer: { userId: 103 }, name: 'Paola DeVoss' }
}
```
We synchronise these by passsing both sets into syncalot.sync(). Syncalot identifies them as maps and will consider the map keys (e.g. f0b91a30) the **id** for each item. We also pass in a key to retrieve the **commonId** for each item. The **commonId** in set1 is retrieved from the id property. The **commonId** in set2 is retrieved by calling a callback function for each item. In set2 the callback retrieves the userId and does some math to make it match with the commonId in set1. Syncalot then uses the **commonId** to match the two sets:
```
// Demo #1.1
console.log(await syncalot.sync({
    set1: set1a,
    set2: set2a,
    key1: 'id',
    key2: (id, item) => item.identifer.userId - 100
}).asMap()));
```

We receive the result as a map, which provides the richest return dataset. In the result we find Susan under the inner key because she is in both sets. She's under key 2 which is the matching commonId for set1 and set2. Remember that we subtracted 100 from the primary key in set2. Under **commonId** 2 there is id1, which is the original **id** in set1 and id2, which is the original **id** in set2. item1 and item2 are verbatim references to the original items. The same structure is present in outerLeft and outerRight, except contain data from one set only.
```
{
  outerLeft: { '1': { id1: '4573cb2a', item1: { id: 1, name: 'Johnny' } } },
  inner: {
    '2': {
      id1: 'f0b91a30',
      item1: { id: 2, name: 'Susan' },
      id2: '5dff2eef',
      item2: { identifer: { primaryKey: 102 }, name: 'Susan Brooks' }
    }
  },
  outerRight: { '3': { id2: 'bf336645', item2: { identifer: { primaryKey: 103 }, name: 'Paola DeVoss' } } }
}
```
If you don't care about the commonIds and you're just interested in the itemdata, you can also request the output as an array:
```
// Demo #1.2
console.log(await syncalot.sync({
    set1: set1a,
    set2: set2a,
    key1: 'id',
    key2: (id, item) => item.identifer.userId - 100
}).asArray()));
```
The result then becomes arrays and the commonId is omitted:
```
{
  outerLeft: [ { id1: '4573cb2a', item1: { id: 1, name: 'Johnny' } } ],
  inner: [
    {
      id1: 'f0b91a30',
      item1: { id: 2, name: 'Susan' },
      id2: '5dff2eef',
      item2: { identifer: { primaryKey: 102 }, name: 'Susan Brooks' }
    }
  ],
  outerRight: [ { id2: 'bf336645', item2: { identifer: { primaryKey: 103 }, name: 'Paola DeVoss' } } ]
}
```
If however you're interested in commonIds only and no item data, you make that specification in asArray
```
// Demo #1.3
console.log(await syncalot.sync({
    set1: set1a,
    set2: set2a,
    key1: 'id',
    key2: (id, item) => item.identifer.userId - 100
}).asArray({ commonIdsOnly: true })));
```
The result then simply has the commonIds in arrays:
```
{
  outerLeft: [ 1 ],
  inner: [ 2 ],
  outerRight: [ 3 ]
}
```
You can also pass commonIdsOnly: true into asMap() which results in a map where each key is the commonId and each value is true.
<a name="#3.2"></a>
## 3.2 Using arrays
We can also use arrays, for example if the datasets look like this:
```
let set1b = [
    { id: 1, name: 'Johnny' },
    { id: 2, name: 'Susan' }
]
let set2b = [
    { identifer: { userId: 102 }, name: 'Susan Brooks' },
    { identifer: { userId: 103 }, name: 'Paola DeVoss' }
]

// Demo #2.1
console.log(await syncalot.sync({
    set1: set1a,
    set2: set2a,
    key1: 'id',
    key2: (id, item) => item.identifer.userId - 100
}).asMap()));
```
We call syncalot in the exact samen way and the result will be identical as with demo #1.1. Another case may be where we have arrays of commonIds. Not specifying a key for an array will result syncalot to use the entry as the commonId.

```
let set1c = [ 1, 2 ]
let set2c = [ 2, 3 ]

// Demo #2.2
console.log(await syncalot.sync({
    set1: set1c,
    set2: set2c,
}).asArray({ commonIdsOnly: true })));
```
The result will be equal to that of demo #1.3:
```
{
  outerLeft: [ 1 ],
  inner: [ 2 ],
  outerRight: [ 3 ]
}
```
<a name="#3.3"></a>
## 3.3 Using streams
To synchronise streams ensure the streams meet these two requirements:
- The stream is placed in objectMode
- The objects in the stream are sorted by the commonId
If those requirements are met, streams are synchronised in the same way as arrays. All demos are runnable from /examples/examples.js. To demonstrate streams we've added a simple StreamArray that streams items in an array.
```
// Demo #3.1
console.log(await syncalot.sync({
    set1: new StreamArray(set1a),
    set2: new StreamArray(set2a),
    key1: 'id',
    key2: (id, item) => item.identifer.userId - 100
}).asMap()));
```

<a name="#3.4"></a>
## 3.4 Receiving results through events
You can choose to not accumulate the results and instead have them be emitted as events, like so:
```
let eventable = syncalot.sync({
    set1: set1a,
    set2: set2a,
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
```
<a name="#3.5"></a>
## 3.5 Receiving results through callbacks
You can choose to not accumulate the results and instead have them be returned through callbacks, like so:
```
await syncalot.sync({
    set1: set1a,
    set2: set2a,
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
```
<a name="#3.6"></a>
## 3.6 Selective sync
The main sync function syncalot.sync() always produces outerLeft, outerRight and inner results. Sometimes that is more than you need. Additionally the following selective syncs are available that all take the exact same options.
- **syncalot.outerLeft()**: Returns only the leftOuter result. For maps and arrays this eliminates a scan over set2 to find items that are not in set1.
- **syncalot.outerRight()**: Returns only the rightOuter result. For maps and arrays this eliminates a scan over set1 to find items that are not in set2.
- **syncalot.inner**(): Returns only the inner result. For maps and arrays this eliminates a scan over set2 to find items that are not in set1.
- **syncalot.outer()**: Returns only leftOuter and rightOuter. This does not eliminate a scan.
- **syncalot.innerLeft()**: Returns only inner and outerLeft. This does not eliminate a scan.
- **syncalot.innerRight()**: Returns only inner and innerRight. This does not eliminate a scan.

<a name ="#4"></a>
## 4. Internals
Syncalot tries to optimize for speed while conserving memory. While doing so there is a three step process to execute a sync:

<a name ="#4.1"></a>
## 4.1 Preparation
Before the sync starts syncalot determines if additional indexing is required to map based on the commonId.
- Stream sets go into the actual sync unprocessed. The commonId is calculated on the fly.
- Map sets with an undefined key go into the actual sync unaltered. The commonId is already present as the key.
- For map sets with a specified key and for arrays a secondary temporary map is always generated that contains key/value pairs for commonId/items. This is a necessary performance hit in order to enable matching.

<a name ="#4.2"></a>
## 4.2 Actual sync
During the actual sync the keys in the provided maps are compared. This is done by iterating over set1 and validating that commonIds exist in set2. At the end of the iteration set2 is iterated to see if any commonIds in set2 do not exist in set1.

If one of the sets is a stream, the stream is iterated and compared to the map of the other set. CommonIds from the stream are removed from the other set. Any remaining commonIds in set2 are then reported. In those cases where a secondary temporary map was created already, the items are removed from the secondary temporary map. For maps without a key a secondary temporary map is still made, so that items can be safely removed without affecting the original set.

If both sets are a stream then they are parsed simultaneously. In every step of the process the stream with the lowest commonId for the current record is moved forward until the other stream has the lowest id. No temporary maps are generated other than during preparation.

<a name ="#4.3"></a>
## 4.3 Results
Syncalot's core outputs results through aggregators classes which are called for each outerLeft, outerRight or inner detection. The aggregators determine if data is returned in memory, forwarded as events or forwarded as callbacks. The asCallbacks() aggregator essentially only forwards those calls. This allows you to implement custom aggregators.
