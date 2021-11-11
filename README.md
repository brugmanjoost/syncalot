# syncalot
Syncalot is a nodejs module used to synchronise datasets. Syncalot easily compares arrays, key/value maps and streams with eachother to identify items that exist in either side or in both.

## What you need to know
Syncalot always compares two sets: **set1** on the left and **set2** on the right. Each item in each set is assumed to have an **id** that uniquely identifies the item within that set. On top of that you specifiy a **key** to dynamically determine the **commonId** for each **item** in the **set** and perform the synchronisation. If a commonId exists in set1 but not in set2, the item from set1 is outputted as **outerLeft**. If a commonId exists in set2 but not in set1, the item from set2 is outputted as **outerRight**. If the commonId exists in both sets then the item is outputted as **inner**.

A key is any one of these three things:
- The name of the item's property: The property value will be used as the commonId.
- A function **(id, item) => { return &lt;your-calculated common-id&gt;; }**: Called for each item the function returns a calculated commonId.
- Undefined: See below
  
**For arrays:** The id for an item is always the index in the array. An unspecified key yields the entry in the array as the commonId.

**For key/value maps:** The id for an item is always the key in the map. An unspecified key yields the key in the map as the commonId.

**For streams:** The id for an item is always the index of the item as it came through the stream. A key is mandatory.

## Installation
```sh
$ npm install buffered-csv
```
# Examples
Following is an extract of samples found in /examples/examples.js

## Examples: The basics
**Example #1.1: Compare arrays with ids, simplified result**

We synchronise two arrays that both contain ids. We don't specify a key, so the entries are the commonIds. We use asArray() with the option commonIdsOnly: true to only retrieve the commonIds:

```
console.log(await syncalot.sync({
  set1: [ 1, 2, 3, 4 ],
  set2: [ 3, 4, 5, 6 ]
}).asArray({ commonIdsOnly: true })));
```

We receive three outputs. outerLeft shows the ids that are present in set1 but not in set2. outerRight shows the ids that are
present in set2 but not in set1. inner shows the ids that are present in both sets:    

```
{
  outerLeft: [ '1', '2' ],
  inner: [ '3', '4' ],
  outerRight: [ '5', '6' ]
}
```
**Example #1.1: Compare arrays with ids, simplified result**

We do the same as in #1.1, but we use asMap() to retrieve a full result:
```
console.log(await syncalot.sync({
  set1: [ 1, 2, 3, 4 ],
  set2: [ 3, 4, 5, 6 ]
}).asMap()));
```

outerLeft, outerRight and inner are now maps. The keys in those maps are the
commonIds and the items are objects. Each object has a id1 or id2 that holds
the id in the original set: in case of an array that will be the array index.
item1/item2 holds the item in the original set: in case of an array that will
be the the array entry:

```
{
  outerLeft: { '1': { id1: '0', item1: 1 }, '2': { id1: '1', item1: 2 } },
  inner: {
    '3': { id1: '2', item1: 3, id2: '0', item2: 3 },
    '4': { id1: '3', item1: 4, id2: '1', item2: 4 }
  },
  outerRight: { '5': { id2: '2', item2: 5 }, '6': { id2: '3', item2: 6 } }
}
```
