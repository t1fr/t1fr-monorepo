/** @type {import('tailwindcss').Config} */

const { createGlobPatternsForDependencies } = require("@nx/vue/tailwind");
const { join } = require("path");

module.exports = {
    content: [join(__dirname, "src/**/*.{vue,js,ts,jsx,tsx}"), ...createGlobPatternsForDependencies(__dirname)],
    theme: {
        extend: {},
    },
    plugins: [require("tailwindcss-primeui")],
};

