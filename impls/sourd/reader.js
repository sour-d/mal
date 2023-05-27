const { log } = require("console");
const { MalSymbol, MalValue, MalList, MalVector, MalBool } = require("./types");

class Reader {
  constructor(tokens) {
    this.tokens = tokens;
    this.position = 0;
  }

  peek() {
    return this.tokens[this.position];
  }

  next() {
    const token = this.peek();
    this.position++;
    return token;
  }
}

const read_seq = (reader, symbol) => {
  const ast = [];

  while (reader.peek() != symbol) {
    if (reader.peek() === undefined) {
      throw "unbalanced";
    }
    ast.push(read_form(reader));
  }
  reader.next();

  return ast;
};

const read_list = reader => {
  const ast = read_seq(reader, ')');
  return new MalList(ast);
};

const read_vector = reader => {
  const ast = read_seq(reader, ']');
  return new MalVector(ast);
};

const read_atom = reader => {
  const token = reader.next();
  if (token.match(/^-?[0-9]+$/)) {
    return new MalValue(parseInt(token));
  }
  if (token == 'true') {
    return new MalBool(true);
  }
  if (token == 'false') {
    return new MalBool(false);
  }
  return new MalSymbol(token);
};

const read_form = reader => {
  const token = reader.peek();
  switch (token) {
    case '(':
      reader.next();
      return read_list(reader);
    case '[':
      reader.next();
      return read_vector(reader);
    default:
      return read_atom(reader);
  }
};

const tokenize = str => {
  const re =
    /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g;
  return [...str.matchAll(re)].map(x => x[1]).slice(0, -1);
};

const read_str = str => {
  const tokens = tokenize(str);
  const reader = new Reader(tokens);
  return read_form(reader);
};

module.exports = { read_str };
