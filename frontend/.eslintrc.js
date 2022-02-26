module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "plugin:react/recommended",
    "airbnb",
    "airbnb-typescript",
    "plugin:react/jsx-runtime",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
    root: true,
    tsconfigRootDir: __dirname, // https://github.com/typescript-eslint/typescript-eslint/issues/251
  },
  plugins: [],
  rules: {
    "import/prefer-default-export": "off",
    "react/jsx-props-no-spreading": [
      "warn",
      {
        html: "ignore",
        custom: "enforce",
        explicitSpread: "enforce",
        exceptions: ["SpreadComponent"],
      },
    ],
  },
};
