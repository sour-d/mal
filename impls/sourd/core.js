const { MalValue, MalBool, MalVector, MalList, MalPrimitive, MalInt, MalNil, MalIterable, MalString } = require("./types");

const applyOperation = (fn, args, context) => {
  if (context === undefined) {
    context = args[0].value;
    args = args.slice(1);
  }
  return new MalValue(
    args.reduce((result, arg) => fn(result, arg.value), context)
  );
};

const compare = (fn, args) => {
  let result = true;

  for (let index = 1; index < args.length; index++) {
    const previousVal = args[index - 1].value;
    const currentVal = args[index].value;

    result = result && fn(previousVal, currentVal);
  }

  return new MalBool(result);
}

const eqaulity = (args) => {
  let result = true;
  for (let index = 0; index < args.length - 1; index++) {
    const element = args[index];
    result = result && element.isEqual(args[index + 1]);
  }
  return new MalBool(result);
};

const concatStrWith = (strs, separator, wrap = false, stringAsString = false) => {
  let result = "";
  for (let index = 0; index < strs.length; index++) {
    let element = strs[index].pr_str();
    result = result.concat(separator + element);
  }

  return wrap ?
    '"' + result.trim() + '"' : result.trim();
};

const core = {
  '+': (...args) => applyOperation((a, b) => a + b, args, 0),
  '*': (...args) => applyOperation((a, b) => a * b, args, 1),
  '-': (...args) => applyOperation((a, b) => a - b, args),
  '/': (...args) => applyOperation((a, b) => a / b, args),
  '>': (...args) => compare((a, b) => a > b, args),
  '<': (...args) => compare((a, b) => a < b, args),
  '=': (...args) => eqaulity(args),
  '>=': (...args) => compare((a, b) => a >= b, args),
  '<=': (...args) => compare((a, b) => a <= b, args),
  'println': (line) => console.log(line),
  'list': (...args) => new MalList(args),
  'list?': (arg) => new MalBool(arg instanceof MalList),
  'empty?': (list) => new MalBool(list.value.length === 0),
  'prn': (...malValues) => {
    console.log(concatStrWith(malValues, " "));
    return new MalNil();
  },
  'pr-str': (...malValues) => {
    const str = concatStrWith(malValues, " ", false, true);
    return new MalString(str);
  },
  'println': (...malValues) => {
    console.log(concatStrWith(malValues, " "));
    return new MalNil();
  },
  'str': (...args) => {
    return new MalPrimitive(concatStrWith(args, "", true));
  },
  'count': (list) => new MalInt(list.value.length)
};

module.exports = { core };
