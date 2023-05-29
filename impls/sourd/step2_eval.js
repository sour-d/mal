const readline = require('readline');
const { read_str } = require('./reader');
const { MalSymbol, MalList, MalValue, MalVector, MalMap, MalPrimitive } = require('./types.js');
// const { pr_str } = require('./printer');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const env = {
  '+': (a, b) => new MalValue(a.value + b.value),
  '*': (a, b) => new MalValue(a.value * b.value),
  '-': (a, b) => new MalValue(a.value - b.value),
  '/': (a, b) => new MalValue(a.value / b.value),
};

const eval_ast = (ast, env) => {
  if (ast instanceof MalPrimitive) return ast;
  if (ast instanceof MalSymbol) return env[ast.value];

  const newAst = ast.value.map(x => EVAL(x, env));
  if (ast instanceof MalList) return new MalList(newAst);
  if (ast instanceof MalMap) return new MalMap(newAst);
  if (ast instanceof MalVector) return new MalVector(newAst);
}

const READ = str => read_str(str);

const EVAL = (ast, env) => {
  if (ast instanceof MalList) {
    if (ast.isEmpty()) return ast;
    const [fn, ...args] = eval_ast(ast, env).value;
    return fn.apply(null, args);
  }

  return eval_ast(ast, env);
};

const PRINT = malValue => malValue.pr_str();

const rep = str => PRINT(EVAL(READ(str), env));


const repl = () => {
  rl.question('user> ', (input) => {
    try {
      console.log(rep(input));
    } catch (e) {
      console.log(e);
    }
    repl();
  });
};

repl();