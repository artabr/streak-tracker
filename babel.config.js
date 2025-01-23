module.exports = (api) => {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],

    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],

          alias: {
            src: "./src",
          },
        },
      ],
      [
        "inline-import",
        {
          extensions: [".sql"],
        },
      ],
    ],
  };
};
