const { MalList } = require("./types");

class Env {
  #outer;
  data;
  constructor(outer, binds = [], args = []) {
    this.#outer = outer;
    this.data = {};
    this.#setBinds(binds, args);
  }

  #setBinds(binds, args) {
    let index = 0;
    while (index < binds.length && binds[index].value !== '&') {
      this.set(binds[index], args[index]);
      index++;
    }
    if (index >= binds.length) {
      return;
    }
    this.set(binds[index + 1], new MalList(args.slice(index)));
  }

  set(symbol, malValue) {
    this.data[symbol.value] = malValue;
  }

  find(symbol) {
    if (this.data[symbol.value]) {
      return this;
    }
    if (this.#outer) {
      return this.#outer.find(symbol);
    }
  }

  get(symbol) {
    const env = this.find(symbol);
    if (!env) throw `${symbol.value} not found.`;
    return env.data[symbol.value];
  }
}

module.exports = { Env };