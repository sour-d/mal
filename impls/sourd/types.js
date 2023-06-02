class MalValue {
  constructor(value) {
    this.value = value;
  }

  pr_str() {
    return this.value.toString();
  }

  isEqual(otherVal) {
    if (!(otherVal instanceof MalValue)) {
      return false;
    }
    if (otherVal.value !== this.value) {
      return false;
    }
    return true;
  }
}

class MalSymbol extends MalValue {
  constructor(value) {
    super(value);
  }

  isEqual(otherVal) {
    if (!(otherVal instanceof MalSymbol)) {
      return false;
    }
    if (otherVal.value !== this.value) {
      return false;
    }
    return true;
  }
}

class MalIterable extends MalValue {
  constructor(value) {
    super(value);
  }

  isEqual(otherVal) {
    if (!(otherVal instanceof MalIterable)) {
      return false;
    }
    if (otherVal.value.length !== this.value.length) {
      return false;
    }
    for (let index = 0; index < this.value.length - 1; index++) {
      if (!this.value[index].isEqual(otherVal.value[index])) {
        return false;
      }
    }
    return true;
  }
}

class MalList extends MalIterable {
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

class MalVector extends MalIterable {
  constructor(value) {
    super(value);
  }

  pr_str() {
    return '[' + this.value.map(x => x.pr_str()).join(' ') + ']';
  }
}

class MalMap extends MalIterable {
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

  isEqual(otherVal) {
    if (!(otherVal instanceof MalPrimitive)) {
      return false;
    }
    if (otherVal.value !== this.value) {
      return false;
    }
    return true;
  }
}

class MalString extends MalPrimitive {
  constructor(value) {
    super(value);
  }

  isEqual(otherVal) {
    if (!(otherVal instanceof MalPrimitive)) {
      return false;
    }
    if (otherVal.value !== this.value) {
      return false;
    }
    return true;
  }

  pr_str() {
    return '\"' + this.value.toString() + '\"';
  }
}


class MalNil extends MalPrimitive {
  constructor() {
    super(null);
  }

  pr_str() {
    return 'nil';
  }

  isEqual(otherVal) {
    if (!(otherVal instanceof MalNil)) {
      return false;
    }
    return true;
  }
}

class MalBool extends MalPrimitive {
  constructor(value) {
    super(value);
  }

  isEqual(otherVal) {
    if (!(otherVal instanceof MalBool)) {
      return false;
    }
    if (otherVal.value !== this.value) {
      return false;
    }
    return true;
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

  isEqual(otherVal) {
    if (!(otherVal instanceof MalInt)) {
      return false;
    }
    if (otherVal.value !== this.value) {
      return false;
    }
    return true;
  }
}

module.exports = {
  MalSymbol, MalValue, MalList,
  MalVector, MalNil, MalBool, MalMap,
  MalPrimitive, MalInt, MalIterable, MalString
};