const readline = require('readline');
const { read_str } = require('./reader');
const { MalSymbol, MalList, MalValue, MalVector, MalMap, MalPrimitive, MalNil, MalBool } = require('./types.js');
const { Env } = require('./env');
const { core } = require('./core');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const handleDef = (ast, env) => {
  env.set(ast.value[1], EVAL(ast.value[2], env));
  return env.get(ast.value[1]);
};

const handleLet = (ast, env) => {
  const newEnv = new Env(env);
  const [_, bindingsList, expression] = ast.value;
  for (let index = 0; index < bindingsList.value.length; index += 2) {
    const key = bindingsList.value[index];
    const value = bindingsList.value[index + 1];
    newEnv.set(key, EVAL(value, newEnv));
  }
  return EVAL(expression, newEnv);
};

const handleIf = (ast, env) => {
  const [ifKywd, condition, ifPart, elsePart] = ast.value;
  const evltdCond = EVAL(condition, env);
  let condResult = true;
  if ((evltdCond instanceof MalNil) || (evltdCond instanceof MalBool)) {
    condResult = evltdCond.value;
  }
  return condResult ? EVAL(ifPart, env) : EVAL(elsePart, env);
}
const handleDo = (ast, env) => {
  const [doKywd, ...doList] = ast.value;
  return doList.reduce((_, list) => EVAL(list, env), new MalNil());

}
const handleFn = (ast, env) => {
  const [fnKywd, bindings, body] = ast.value;
  return (...args) => {
    const newEnv = new Env(env);
    if (bindings.length === args.length) throw "Unmatched binding";
    for (let index = 0; index < bindings.value.length; index++) {
      if (bindings.value[index].value === '&') {
        newEnv.set(
          bindings.value[index + 1],
          new MalVector(EVAL(args.slice(index), newEnv))
        );
        break;
      }
      newEnv.set(bindings.value[index], EVAL(args[index], newEnv));
    }
    return EVAL(body, newEnv);
  };
}

const eval_ast = (ast, env) => {
  if (ast === undefined) return new MalNil();
  if (ast instanceof MalSymbol) return env.get(ast);

  if (ast instanceof MalList) {
    const newAst = ast.value.map(x => EVAL(x, env));
    return new MalList(newAst);
  }
  if (ast instanceof MalMap) {
    const newAst = ast.value.map(x => EVAL(x, env));
    return new MalMap(newAst);
  }
  if (ast instanceof MalVector) {
    const newAst = ast.value.map(x => EVAL(x, env));
    return new MalVector(newAst);
  }
  return ast;
}

const READ = str => read_str(str);

const EVAL = (ast, env) => {
  if (ast instanceof MalList) {
    if (ast.isEmpty()) return ast;

    switch (ast.value[0].value) {
      case "def!":
        return handleDef(ast, env);
      case "let*":
        return handleLet(ast, env);
      case "if":
        return handleIf(ast, env);
      case "do":
        return handleDo(ast, env);
      case "fn*":
        return handleFn(ast, env);
    }

    const [fn, ...args] = eval_ast(ast, env).value;
    return fn.apply(null, args);
  }

  return eval_ast(ast, env);
};

const PRINT = malValue => malValue.pr_str();

const repl_env = new Env();
Object.keys(core).forEach(key =>
  repl_env.set(new MalSymbol(key), core[key]));

const rep = str => PRINT(EVAL(READ(str), repl_env));


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