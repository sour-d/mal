// const pr_str = malValue => {
//   if (malValue instanceof MalValue)
//     return malValue.pr_str();

//   return malValue.toString();
// };

class MalValue {
  constructor(value) {
    this.value = value;
  }

  pr_str() {
    return this.value.toString();
  }
}

class MalSymbol extends MalValue {
  constructor(value) {
    super(value);
  }
}

class MalList extends MalValue {
  constructor(value) {
    super(value);
  }

  pr_str() {
    return '(' + this.value.map(x => x.pr_str()).join(' ') + ')';
  }

  isEmpty() {
    return this.value.length == 0;
  }
}

class MalVector extends MalValue {
  constructor(value) {
    super(value);
  }

  pr_str() {
    return '[' + this.value.map(x => x.pr_str()).join(' ') + ']';
  }
}

class MalNil extends MalValue {
  constructor(value) {
    super(null);
  }

  pr_str() {
    return 'nil';
  }
}

class MalBool extends MalValue {
  constructor(value) {
    super(value);
  }
}

class MalMap extends MalValue {
  constructor(value) {
    super(value);
  }

  pr_str() {
    return '{' + this.value.map(x => x.pr_str()).join(' ') + '}';
  }
}

class MalPrimitive extends MalValue {
  constructor(value) {
    super(value);
  }
}

class MalInt extends MalPrimitive {
  constructor(value) {
    super(value);
  }

  add(otherMalPrimitive) {
    if (otherMalPrimitive instanceof MalPrimitive) {
      return this.value + otherMalPrimitive.value;
    }

    throw "Operation undone";
  }
}

module.exports = {
  MalSymbol, MalValue, MalList,
  MalVector, MalNil, MalBool, MalMap,
  MalPrimitive, MalInt
};