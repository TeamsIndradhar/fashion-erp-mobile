/** @type {import('jest').Config} */
module.exports = {
  preset: "jest-expo",
  testMatch: ["**/src/**/*.test.ts", "**/src/**/*.test.tsx", "**/app/**/*.test.tsx"],
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
  testPathIgnorePatterns: ["/node_modules/", "/design/"],
};
