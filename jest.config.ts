import type { Config } from "jest";

const config: Config = {
	clearMocks: true,
	collectCoverage: true,
	coverageDirectory: "coverage",
	coveragePathIgnorePatterns: ["/node_modules/", "/dist/"],
	coverageProvider: "v8",
	coverageReporters: ["json", "text", "lcov", "clover"],
	moduleFileExtensions: ["ts"],
	notify: true,
	preset: "ts-jest",
	reporters: [
		"default",
		[
			"jest-junit",
			{
				outputDirectory: "test-results/junit",
				outputName: "junit.xml"
			}
		]
	],
	resetMocks: true,
	restoreMocks: true,
	rootDir: ".",
	roots: ["./src", "./tests"],
	testEnvironment: "node",
	testMatch: [
		// "**/tests/**/*.[jt]s?(x)",
		// "**/?(*.)+(spec|test).[tj]s?(x)",
		// "**/__tests__/**/*.ts",
		"**/tests/**/*.test.ts",
		"**/tests/**/*.spec.ts"
	],
	testPathIgnorePatterns: ["/node_modules/", "/dist/"],
	transform: {
		"^.+\\.ts$": "ts-jest"
	},
	transformIgnorePatterns: ["/node_modules/", "\\.pnp\\.[^\\/]+$"],
	verbose: true,
	watchman: true
};

export default config;
