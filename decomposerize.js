const decomposerize = require("decomposerize");
const { existsSync, readFileSync } = require("fs");

function decompose(filename) {
    if (!filename) return;

    if (!existsSync(filename)) return;

    const content = readFileSync(filename, { encoding: "utf-8" });

    console.log(decomposerize(content, { detach: true, command: "docker --config ./tmp run" }));
}

decompose(process.argv[2]);
