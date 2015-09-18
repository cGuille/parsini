var util = require('util');

var Parser = require('./parser');

module.exports = function (iniString) {
    var parser = new IniParser(iniString);
    parser.parse();
    return parser.document;
};

function IniParser(input) {
    this.document = {};
    IniParser.super_.call(this, input);
}
util.inherits(IniParser, Parser);

IniParser.prototype.parse = function IniParser_parse() {
    var section, sectionName, pairs;

    this.removeComments();
    this.consumeWhitespaces();
    do {
        sectionName = this.parseSection();
        section = sectionName === null ? this.document : {};
        pairs = this.parseKeyValuePairs();
        pairs.forEach(function (pair) { section[pair.key] = pair.value; });
        if (sectionName !== null) {
            this.document[sectionName] = section;
        }
        this.consumeWhitespaces();
    } while (!this.eof());
};

// var comments = /;(?=([^"\\]*(\\.|"([^"\\]*\\.)*[^"\\]*"))*[^"]*$)$/mg;
var comments = /^\s*[;#].*$/mg;
IniParser.prototype.removeComments = function IniParser_removeComments() {
    this.input = this.input.replace(comments, '');
    this.inputLength = this.input.length;
};

IniParser.prototype.parseSection = function IniParser_parseSection() {
    if (this.nextChar() !== '[') {
        return null;
    }

    this.consumeChar();
    var sectionName = this.consumeWhile(function (c) { return c !== ']'; });
    this.consumeChar();

    return sectionName;
};

IniParser.prototype.parseKeyValuePairs = function IniParser_parseKeyValuePairs() {
    var pairs = [];
    var pair = null;

    this.consumeWhitespaces();
    while (!this.eof() && this.nextChar() !== '[') {
        pair = this.parseKeyValue();
        if (pair === null) {
            break;
        }
        pairs.push(pair);
        this.consumeWhitespaces();
    }

    return pairs;
};

IniParser.prototype.parseKeyValue = function IniParser_parseKeyValue() {
    return { key: this.parseKey(), value: this.parseValue() };
};

IniParser.prototype.parseKey = function IniParser_parseKey() {
    this.consumeWhitespaces();
    var key = this.consumeWhile(function (c) { return !this.nextIsWhitespace() && c !== '='; });
    this.consumeWhile(function (c) { return c !== '='; });
    this.consumeChar();
    return key;
};

IniParser.prototype.parseValue = function IniParser_parseValue() {
    this.consumeWhile(function (c) {
        return this.nextIsWhitespace() && c !== '\n' && c !== '\r';
    });
    var next = this.nextChar();
    if (next === '\n' || next === '\r') {
        return null;
    }
    return this.consumeLine();
};
