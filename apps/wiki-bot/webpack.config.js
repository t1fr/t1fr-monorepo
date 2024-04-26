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
            assets: ["./src/config/application.yaml", "./src/i18n"],
            watch: true,
            optimization: false,
            outputHashing: "none",
        }),
    ],
};
