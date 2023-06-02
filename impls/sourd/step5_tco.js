const readline = require('readline');
const { read_str } = require('./reader');
const { MalSymbol, MalList, MalValue, MalVector, MalMap, MalPrimitive, MalNil, MalBool, MalFunction } = require('./types.js');
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
  const [_, bindingsList, ...expression] = ast.value;
  for (let index = 0; index < bindingsList.value.length; index += 2) {
    const key = bindingsList.value[index];
    const value = bindingsList.value[index + 1];
    newEnv.set(key, EVAL(value, newEnv));
  }

  const doForm = new MalList([new MalSymbol("do"), ...expression]);
  return [doForm, newEnv];
};

const handleIf = (ast, env) => {
  const [ifKywd, condition, ifPart, elsePart] = ast.value;
  const evltdCond = EVAL(condition, env);
  let condResult = true;
  if ((evltdCond instanceof MalNil) || (evltdCond instanceof MalBool)) {
    condResult = evltdCond.value;
  }
  // return condResult ? EVAL(ifPart, env) : EVAL(elsePart, env);
  return condResult ? ifPart : elsePart;
};

const handleDo = (ast, env) => {
  const [_, ...doList] = ast.value;
  doList.slice(0, -1).reduce((_, list) => EVAL(list, env), new MalNil());
  return doList[doList.length - 1];
};

const handleFn = (ast, env) => {
  const [_, bindings, ...body] = ast.value;
  const doForms = new MalList([new MalSymbol("do"), ...body]);
  return new MalFunction(doForms, bindings, env);
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
  while (true) {
    if (!(ast instanceof MalList)) return eval_ast(ast, env);

    if (ast.isEmpty()) return ast;
    switch (ast.value[0].value) {
      case "def!":
        return handleDef(ast, env);
      case "let*":
        [env, ast] = handleLet(ast, env);
        break;
      case "if":
        return handleIf(ast, env);
      case "do":
        ast = handleDo(ast, env);
        break;
      case "fn*":
        ast = handleFn(ast, env);
        break;
      default:
        const [fn, ...args] = eval_ast(ast, env).value;
        if (fn instanceof MalFunction) {
          ast = fn.value;
          const binds = fn.binds;
          const oldEnv = fn.env;
          env = new Env(oldEnv, binds.value, args);
        } else {
          return fn.apply(null, args);
        }
    }
  }
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