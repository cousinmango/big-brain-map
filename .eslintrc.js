"use strict";

/**
 * @type {import("eslint").Linter.Config}
 */
const config = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["eslint:recommended", "google"],
  parserOptions: {
    ecmaVersion: 12,
    amd: true,
    node: true,
  },
  rules: {
    indent: ["error", 2],
    quotes: ["error", "double", { allowTemplateLiterals: true }],
    semi: ["error", "always"],
    "quote-props": ["error", "as-needed"],
    "prefer-template": "error",
    "no-template-curly-in-string": "error",
    "no-var": 2,
    "no-const-assign": "error",
    radix: "error",
    "prefer-const": "error",
    "prefer-spread": "error",
    eqeqeq: ["error", "always"],
    "default-case": 2,
    "object-curly-spacing": ["error", "always"],
    "newline-before-return": "error",
    "no-use-before-define": [
      "error",
      { functions: false, classes: false, variables: true },
    ],
    "linebreak-style": "off",
    strict: ["error", "global"],

  },
};

module.exports = config;
