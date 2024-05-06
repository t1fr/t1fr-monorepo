/* eslint-disable */

const esModules = ['lodash-es'];


module.exports = {
    displayName: "backend-member-manage",
    preset: "../../../jest.preset.js",
    testEnvironment: "node",
    transform: {
        "^.+\\.[tj]s$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }],
    },
    transformIgnorePatterns: [
        `<rootDir>/node_modules/(?!.*\\.mjs$|${esModules.join('|')})`,
    ],
    moduleFileExtensions: ["ts", "js", "html"],
    coverageDirectory: "../../../coverage/libs/backend/member-manage",
};
