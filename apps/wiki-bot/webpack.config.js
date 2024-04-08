const { NxWebpackPlugin } = require("@nx/webpack");
const { join } = require("path");

module.exports = {
    output: {
        path: join(__dirname, "../../dist/apps/wiki-bot"),
    },
    plugins: [
        new NxWebpackPlugin({
            target: "node",
            compiler: "tsc",
            main: "./src/main.ts",
            tsConfig: "./tsconfig.app.json",
            assets: ["./src/config", "./src/i18n"],
            optimization: false,
            outputHashing: "none",
        }),
    ],
};