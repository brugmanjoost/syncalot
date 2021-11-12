module.exports = (key) => {
    if (key === undefined)
        return (idx, item) => item;
    if (typeof key === 'function')
        return key;
    return (idx, item) => item[key];
}
