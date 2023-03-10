module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    // TODO: Remove plugin when it lands upstream
    plugins: [
      "@babel/plugin-proposal-logical-assignment-operators",
      "@babel/plugin-proposal-export-namespace-from",
      "react-native-reanimated/plugin",
    ],
  };
};
