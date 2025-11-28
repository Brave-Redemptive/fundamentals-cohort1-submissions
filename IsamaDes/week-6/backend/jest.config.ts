import type { Config } from "jest";

export default async (): Promise<Config> => {
  return {
    preset: `ts-jest`,
    testEnvironment: "node",

    roots: ["<rootDir>/test"],

     testMatch: ["**/*.test.ts"],

     setupFilesAfterEnv: ["<rootDir>/test/setup.ts"],

    transform: {
      "^.+\\.(ts|tsx)$": [
        "ts-jest",
        {
          useESM: true,
          tsconfig: "tsconfig.test.json",
        },
      ],
    },

     moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testPathIgnorePatterns: ["/node_modules/", "/build/"],

      // Coverage configuration
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov"],

    // Handles async resources & forces exit
    detectOpenHandles: true,
    forceExit: true,
  };
};
