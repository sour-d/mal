const takeInput = () => {
  process.stdout.write("user> ")
  process.stdin.on("data", (data) => {
    process.stdout.write(data);
    process.stdout.write("user> ")
  });
};

takeInput();