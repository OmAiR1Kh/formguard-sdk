import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/formguard.js",
      format: "umd",
      name: "FormGuard",
      sourcemap: true,
    },
    {
      file: "dist/formguard.esm.js",
      format: "esm",
      sourcemap: true,
    },
  ],
  plugins: [typescript()],
};
