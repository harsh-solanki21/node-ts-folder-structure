import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
	{
		files: ["**/*.ts"],
		ignores: ["node_modules/*", "dist/*"],
		languageOptions: {
			ecmaVersion: 2021,
			sourceType: "module",
			globals: globals.node,
		},
		rules: {
			semi: "warn",
			curly: "error",
			eqeqeq: ["error", "always"],
			"no-unused-vars": "warn",
			"no-unused-expressions": "warn",
			"no-console": "warn",
			"consistent-return": "error",
			"no-else-return": "error",
			"no-empty-function": "error",
			"no-multiple-empty-lines": ["error", { max: 1 }],
			"no-var": "error",
			"prefer-const": "error",
			"prefer-arrow-callback": "error",
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{ argsIgnorePattern: "^_" },
			],
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/explicit-function-return-type": [
				"warn",
				{
					allowExpressions: true,
					allowTypedFunctionExpressions: true,
				},
			],
		},
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
];
