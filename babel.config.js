module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    // TODO: Remove plugin when it lands upstream
    plugins: [
      "@babel/plugin-proposal-logical-assignment-operators",
      "react-native-reanimated/plugin",
    ],
  };
};
