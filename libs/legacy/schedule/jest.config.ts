/* eslint-disable */
module.exports = {
    displayName: "legacy-schedule",
    preset: "../../../jest.preset.js",
    testEnvironment: "node",
    transform: {
        "^.+\\.[tj]s$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }],
    },
    moduleFileExtensions: ["ts", "js", "html"],
    coverageDirectory: "../../../coverage/libs/legacy/schedule",
};
