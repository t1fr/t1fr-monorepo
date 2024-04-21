const { NxWebpackPlugin } = require("@nx/webpack");
const { join } = require("path");

module.exports = {
    output: {
        path: join(__dirname, "../../dist/apps/manage-bot"),
    },
    plugins: [
        new NxWebpackPlugin({
            target: "node",
            compiler: "tsc",
            main: "./src/main.ts",
            tsConfig: "./tsconfig.app.json",
            assets: ["./src/config"],
            optimization: false,
            outputHashing: "none",
        }),
    ],
};
