module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  extends: [
    'airbnb-base'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'no-console': 'off',
    'import/extensions': 'off',
    'class-methods-use-this': 'off',
    'no-underscore-dangle': 'off'
  }
};
