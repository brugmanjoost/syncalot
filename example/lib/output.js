const util = require('util')

const COLORS = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",

    FgBlack: "\x1b[30m",
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m",
    FgMagenta: "\x1b[35m",
    FgCyan: "\x1b[36m",
    FgWhite: "\x1b[37m",

    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m",
}

function writeParagraph(paragraph, maxLineLength) {
    let words = paragraph.replace(/\n/g, ' ').replace(/\s+\s/g, ' ').replace(/^\s*/g, '').replace(/\s*$/g, '').split(' ');
    let count = 0;
    let space = '';
    for (const word of words) {
        count += space.length + word.length;

        if (count > maxLineLength) {
            console.log();
            count = word.length;
            space = '';
        }
        process.stdout.write(space + word);
        space = ' ';
    }
    console.log();
    console.log();
}

module.exports = {
    showResult: (title, data) => {
        console.log(COLORS.BgYellow + COLORS.FgBlack + (title + ' '.repeat(79)).substr(0, 79) + COLORS.Reset);
        if (data !== undefined) {
            console.log(util.inspect(data, { showHidden: false, depth: null, colors: true }));
            console.log();
        }
    },
    showSection: (title) => {
        console.log();
        console.log();
        console.log();
        console.log(COLORS.BgYellow + COLORS.FgBlack + '='.repeat(79));
        console.log((title + ' '.repeat(79)).substr(0, 79));
        console.log('='.repeat(79) + COLORS.Reset);
        console.log();
    }
}