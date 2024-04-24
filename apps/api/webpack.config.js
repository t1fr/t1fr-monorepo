const { NxWebpackPlugin } = require("@nx/webpack");
const { join, posix } = require("path");

module.exports = {
    output: {
        path: join(__dirname, "../../dist/apps/api"),
    },
    plugins: [
        new NxWebpackPlugin({
            target: "node",
            compiler: "tsc",
            main: "./src/main.ts",
            tsConfig: "./tsconfig.app.json",
            assets: ["./src/assets", "./src/config"],
            optimization: false,
            outputHashing: "none",
        }),
    ],
};
