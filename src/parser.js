module.exports = Parser;

var isWhitespace = RegExp.prototype.test.bind(/^\s$/);

function Parser(input) {
    this.input = input;
    this.inputLength = input.length;
    this.position = 0;
}

Parser.prototype.nextChar = function Parser_nextChar() {
    return this.input[this.position];
};

Parser.prototype.nextIsWhitespace = function Parser_nextIsWhitespace() {
    return isWhitespace(this.nextChar());
};

Parser.prototype.startsWith = function Parser_startsWith(string) {
    return this.input.indexOf(string, this.position) === 0;
};

Parser.prototype.eof = function Parser_eof() {
    return this.position >= this.inputLength;
};

Parser.prototype.eol = function Parser_eol() {
    var c = this.nextChar();
    return c === '\n' || c === '\r';
};

Parser.prototype.consumeChar = function Parser_consumeChar() {
    return this.input[this.position++];
};

Parser.prototype.consumeWhile = function Parser_consumeWhile(cond) {
    var result = '';
    while (!this.eof() && cond.call(this, this.nextChar())) {
        result += this.consumeChar();
    }
    return result;
};

Parser.prototype.consumeLine = function Parser_consumeLine() {
    return this.consumeWhile(function () { return !this.eol(); });
};

Parser.prototype.consumeWhitespaces = function Parser_consumeWhitespaces() {
    return this.consumeWhile(isWhitespace);
};
