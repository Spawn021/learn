// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettier from 'eslint-plugin-prettier'; // Import plugin Prettier đúng cách
import globals from 'globals';
import tseslint from '@typescript-eslint/eslint-plugin'; // Import plugin TypeScript đúng cách

// @ts-ignore
export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  // @ts-ignore
  ...tseslint.configs.recommendedTypeChecked,
  {
    plugins: ['prettier'], // Đảm bảo Prettier được thêm vào plugin
    extends: [
      'plugin:prettier/recommended',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname, // Sử dụng __dirname thay vì import.meta.dirname
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
);
