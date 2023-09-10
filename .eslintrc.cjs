module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked', // Cambiamos esta línea
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',  // Agregamos esta línea
    'plugin:react/jsx-runtime',  // Agregamos esta línea
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {  // Agregamos esta sección
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: ['react-refresh', '@typescript-eslint', 'react'],  // Agregamos '@typescript-eslint' y 'react'
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    // Puedes agregar aquí más reglas si lo necesitas en el futuro
  },
}
