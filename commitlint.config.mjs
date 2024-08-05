export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", ["Feat", "Fix", "Chore", "Docs", "Style", "Refactor", "Test"]],
    "type-case": [0, "never", ["lower-case"]],
    "subject-case": [0, "never", ["sentence-case", "start-case", "pascal-case", "upper-case"]],
  },
};
