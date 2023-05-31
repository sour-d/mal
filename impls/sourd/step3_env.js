const readline = require('readline');
const { read_str } = require('./reader');
const { MalSymbol, MalList, MalValue, MalVector, MalMap, MalPrimitive, MalNil } = require('./types.js');
const { Env } = require('./env');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// const env = {
//   '+': (a, b) => new MalValue(a.value + b.value),
//   '*': (a, b) => new MalValue(a.value * b.value),
//   '-': (a, b) => new MalValue(a.value - b.value),
//   '/': (a, b) => new MalValue(a.value / b.value),
// };

const eval_ast = (ast, env) => {
  if (ast instanceof MalPrimitive) return ast;
  if (ast instanceof MalSymbol) return env.get(ast);

  const newAst = ast.value.map(x => EVAL(x, env));
  if (ast instanceof MalList) return new MalList(newAst);
  if (ast instanceof MalMap) return new MalMap(newAst);
  if (ast instanceof MalVector) return new MalVector(newAst);
}

const READ = str => read_str(str);

const EVAL = (ast, env) => {
  if (ast instanceof MalList) {
    if (ast.isEmpty()) return ast;

    switch (ast.value[0].value) {
      case "def!":
        env.set(ast.value[1], EVAL(ast.value[2], env));
        return env.get(ast.value[1]);
      case "let*":
        const newEnv = new Env(env);
        const [_, bindingsList, expression] = ast.value;
        for (let index = 0; index < bindingsList.value.length; index += 2) {
          const key = bindingsList.value[index];
          const value = bindingsList.value[index + 1];
          newEnv.set(key, EVAL(value, newEnv));
        }
        return EVAL(expression, newEnv);
    }

    const [fn, ...args] = eval_ast(ast, env).value;
    return fn.apply(null, args);
  }

  return eval_ast(ast, env);
};

const PRINT = malValue => malValue.pr_str();

const env = new Env();
env.set(new MalSymbol('+'), (a, b) => new MalValue(a.value + b.value));
env.set(new MalSymbol('*'), (a, b) => new MalValue(a.value * b.value));
env.set(new MalSymbol('-'), (a, b) => new MalValue(a.value - b.value));
env.set(new MalSymbol('/'), (a, b) => new MalValue(a.value / b.value));
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