module.exports = {
  env: {
    browser: true,
    es6: true,
    commonjs: true,
    node: true,
    worker: true
  },
  extends: ["eslint:recommended", "plugin:vue/essential"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  plugins: ["vue"],
  rules: {
    "no-useless-escape": [0],
    "no-unused-vars": [1]
  }
};
