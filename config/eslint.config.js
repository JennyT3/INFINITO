import next from 'eslint-config-next';
import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';

export default [
	js(),
	next(),
	{
		plugins: {
			react,
			'@typescript-eslint': tseslint,
		},
		languageOptions: {
			parser: tsparser,
			ecmaVersion: 'latest',
			sourceType: 'module',
			ecmaFeatures: { jsx: true },
		},
		rules: {
			'react/react-in-jsx-scope': 'off',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
			'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
			'no-console': 'warn',
		},
	},
]; 
