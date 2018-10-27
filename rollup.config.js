import typescript from "rollup-plugin-typescript";
import { uglify } from "rollup-plugin-uglify";

export default [
  {
    external: ["identitate", "fast-equals", "reselect", "unchanged"],
    input: "src/index.ts",
    output: {
      exports: "named",
      globals: {
        identitate: "identitate",
        "fast-equals": "fe",
        reselect: "Reselect",
        unchanged: "unchanged"
      },
      name: "selectorator",
      file: "dist/selectorator.js",
      format: "umd",
      sourcemap: true
    },
    plugins: [typescript()]
  },
  {
    external: ["identitate", "fast-equals", "reselect", "unchanged"],
    input: "src/index.ts",
    output: {
      exports: "named",
      globals: {
        identitate: "identitate",
        "fast-equals": "fe",
        reselect: "Reselect",
        unchanged: "unchanged"
      },
      name: "selectorator",
      file: "dist/selectorator.min.js",
      format: "umd"
    },
    plugins: [typescript(), uglify()]
  }
];
