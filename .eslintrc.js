module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    // 'plugin:jsdoc/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['prettier'],
  settings: {
    jsdoc: {
      mode: 'typescript',
    },
  },
  rules: {
    'prettier/prettier': [
      'warn',
      {
        bracketSpacing: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'es5',
      },
    ],
    'no-unused-vars': 'warn',
    'jsdoc/require-property-description': 'off',
    'jsdoc/require-param-description': 'off',
    'jsdoc/require-returns-description': 'off',
    'require-jsdoc': [
      1,
      {
        require: {
          MethodDefinition: true,
        },
      },
    ],
  },
};
