/* eslint-disable no-magic-numbers */

/**
 * @type {import("eslint").Linter.Config}
 */
const config = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  extends: [
    // "airbnb",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",

    // "eslint:recommended",
    // "google",
    // "plugin:@typescript-eslint/eslint-recommended",
    // "plugin:@typescript-eslint/recommended",
    // // Resolve conflicting eslint vs prettier
    "prettier/@typescript-eslint",

    // Enable eslint-plugin-prettier and eslint-config-prettier.
    // This will display prettier errors as ESLint errors.
    // Make sure this is always the last configuration in the extends array.
    // "prettier",
    // "plugin:prettier/recommended"
  ],

  parserOptions: {
    amd: true,
    project: "./tsconfig.json",
    tsconfigRootDir: ".",
    ecmaFeatures: {
      arrowFunctions: true,
      binaryLiterals: true,
      blockBindings: true,
      classes: true,
      defaultParams: true,
      destructuring: true,
      experimentalObjectRestSpread: true,
      forOf: true,
      generators: true,
      globalReturn: true,
      impliedStrict: true,
      jsx: true,
      modules: true,
      objectLiteralComputedProperties: true,
      objectLiteralDuplicateProperties: true,
      objectLiteralShorthandMethods: true,
      objectLiteralShorthandProperties: true,
      octalLiterals: true,
      regexUFlag: true,
      regexYFlag: true,
      restParams: true,
      spread: true,
      superInFunctions: true,
      templateStrings: true,
      unicodeCodePointEscapes: true,
    },
    ecmaVersion: 2021,
    node: true,
    sourceType: "module",
  },
  rules: {
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/typedef": "error",
    "@typescript-eslint/explicit-function-return-type": ["error"],
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-angle-bracket-type-assertion": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-inferrable-types": "off",

    "@typescript-eslint/prefer-interface": "off", // also want to use "type"

    "prettier/prettier": [
      "error",
      {
        singleQuote: false,
        semi: true,
      },
    ],
    "array-bracket-newline": ["error", { minItems: 2 }],
    "array-bracket-spacing": "error",
    "array-element-newline": "error",
    "arrow-spacing": "error",
    "brace-style": "error",

    camelcase: "error",
    "comma-dangle": ["error", "always-multiline"],

    "default-case": 2,

    eqeqeq: ["error", "always"],

    indent: ["error", 2],
    "linebreak-style": "off",
    "max-len": ["error", 120],

    "newline-before-return": "error",
    "no-const-assign": "error",
    "no-extra-semi": "error",
    "no-multiple-empty-lines": "error",

    "no-template-curly-in-string": "error",
    "no-trailing-spaces": "error",
    "no-use-before-define": [
      "error",
      {
        classes: false,
        functions: false,
        variables: true,
      },
    ],

    "no-var": 2,

    "object-curly-spacing": ["error", "always"],
    "prefer-const": "error",
    "prefer-spread": "error",

    "quote-props": ["error", "as-needed"],
    quotes: [
      "error",
      "double",
      {
        allowTemplateLiterals: true,
        avoidEscape: true,
      },
    ],

    radix: "error",

    semi: ["error", "always"],
    strict: ["error", "global"],
  },
};

module.exports = config;
