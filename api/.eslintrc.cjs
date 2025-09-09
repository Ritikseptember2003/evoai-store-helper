module.exports = {
  // Specifies the parser that will be used to analyze the code
  parser: '@typescript-eslint/parser',
  
  // Specifies the ESLint plugins to use
  plugins: ['@typescript-eslint/eslint-plugin'],
  
  // Extends recommended rule sets
  extends: [
    'eslint:recommended', // Core ESLint rules
    'plugin:@typescript-eslint/recommended', // Recommended rules from the @typescript-eslint/eslint-plugin
  ],
  
  // The root directory that ESLint should scan
  root: true,
  
  // Specifies the environment the code will run in
  env: {
    node: true, // Enables Node.js global variables and Node.js scoping.
    jest: true, // Enables Jest global variables.
  },
  
  // Ignore files and directories
  ignorePatterns: ['.eslintrc.cjs'],
  
  // Custom rules can be added or overridden here
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};