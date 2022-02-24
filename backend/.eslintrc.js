module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "airbnb-base",
    "airbnb-typescript/base",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    root: true,
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname, // https://github.com/typescript-eslint/typescript-eslint/issues/251
  },
  settings: {
    typescript: {
      project: "./tsconfig.json",
    },
  },
  plugins: [],
  rules: {
    "import/prefer-default-export": "off",
  },
};
