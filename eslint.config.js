import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import checkFile from 'eslint-plugin-check-file';
import prettier from 'eslint-config-prettier';

/**
 * Mesmas regras de nome do backend (backend-node-pk), adaptadas ao React:
 * componentes e styled-components são variáveis/funções em PascalCase.
 */
export default tseslint.config(
  { ignores: ['.next', 'out', 'node_modules', 'coverage', 'next-env.d.ts', 'scripts'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended, prettier],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    plugins: { 'react-hooks': reactHooks, 'check-file': checkFile },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'with-single-extends' }],
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'default', format: ['camelCase'], leadingUnderscore: 'allow' },
        { selector: 'import', format: ['camelCase', 'PascalCase'] },
        { selector: 'variable', format: ['camelCase', 'PascalCase', 'UPPER_CASE'], leadingUnderscore: 'allow' },
        {
          selector: 'variable',
          types: ['boolean'],
          format: ['PascalCase'],
          prefix: ['is', 'has', 'should'],
        },
        // `GET`, `POST`... são os nomes exigidos pelos Route Handlers do Next
        { selector: 'function', format: ['camelCase', 'PascalCase', 'UPPER_CASE'] },
        { selector: 'parameter', format: ['camelCase', 'snake_case'], leadingUnderscore: 'allow' },
        // Componente desestruturado de um import dinâmico: `({ LoginPage }) => ...`
        { selector: 'parameter', modifiers: ['destructured'], format: ['camelCase', 'PascalCase', 'snake_case'] },
        { selector: 'interface', format: ['PascalCase'], prefix: ['i'] },
        { selector: 'typeAlias', format: ['PascalCase'], prefix: ['t'] },
        { selector: 'enum', format: ['PascalCase'], prefix: ['e'] },
        { selector: 'enumMember', format: ['camelCase', 'snake_case', 'UPPER_CASE'] },
        { selector: 'typeParameter', format: ['PascalCase'] },
        { selector: 'class', format: ['PascalCase'] },
        // Getters de variáveis de ambiente (`Env.DB_HOST`)
        { selector: 'classicAccessor', format: ['camelCase', 'UPPER_CASE'] },
        // Propriedades vêm da API (snake_case), de headers e de CSS
        { selector: ['objectLiteralProperty', 'typeProperty'], format: null },
      ],
      'check-file/filename-naming-convention': [
        'error',
        { 'src/**/*.{ts,tsx}': 'KEBAB_CASE' },
        { ignoreMiddleExtensions: true },
      ],
      'check-file/folder-naming-convention': [
        'error',
        // Rotas dinâmicas do Next usam colchetes: src/app/estudo/[materia]
        { 'src/!(app)/**/': 'KEBAB_CASE', 'src/app/**/': '@(+([a-z0-9])*(-+([a-z0-9]))|\\[+([a-z])\\])' },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  {
    // Banco: migrations numeradas em snake_case (padrão dos backends), scripts de terminal e model gerado
    files: ['src/database/**'],
    rules: {
      'check-file/filename-naming-convention': [
        'error',
        { 'src/database/migrations/*.ts': '+([0-9])_+([a-z0-9_])', 'src/database/db/*.ts': 'KEBAB_CASE' },
        { ignoreMiddleExtensions: true },
      ],
      'no-console': 'off',
    },
  },
  {
    files: ['src/database/db/model.ts'],
    rules: { '@typescript-eslint/naming-convention': 'off' },
  },
  {
    files: ['src/**/*.test.{ts,tsx}', 'src/tests/**'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      // Rotas da API simulada como chave: `'GET /api/simulados': () => ...`
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'objectLiteralMethod', format: null },
        { selector: 'variable', format: ['camelCase', 'PascalCase', 'UPPER_CASE'], leadingUnderscore: 'allow' },
      ],
    },
  }
);
