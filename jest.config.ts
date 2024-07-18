export default {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^~/api/(.*)$": "<rootDir>/src/api/$1",
    "^~/config/(.*)$": "<rootDir>/src/config/$1",
    "^~/infrastructure/(.*)$": "<rootDir>/src/infrastructure/$1",
    "^~/types/(.*)$": "<rootDir>/src/types/$1",
    "^~/utils/(.*)$": "<rootDir>/src/utils/$1",
  },
  moduleFileExtensions: ["js", "ts", "json", "node"],
};
