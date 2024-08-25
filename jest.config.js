module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/**/?(*.)+(spec|test).[tj]s?(x)"],
  moduleFileExtensions: ["ts", "js"],
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.{ts,js}", "!src/types/*", "!src/**/index.ts"],
};
