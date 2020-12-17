
/**
 * @type {import("eslint").Linter.Config}
 */
const config = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: 12,
    amd: true,
    node: true,
  },
  rules: {
    indent: ["error", 2],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "quote-props": ["error", "as-needed"],
    "no-var": 2,
    "no-const-assign": "error",
    radix: "error",
    "prefer-template": "error",
    "prefer-const": "error",
    "prefer-spread": "error",
    eqeqeq: ["error", "always"],
    "default-case": 2,

    "newline-before-return": "error",
    "no-use-before-define": [
      "error",
      { functions: false, classes: false, variables: true },
    ],
    
  },
};

module.exports = config;