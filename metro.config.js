/* eslint-env node */

// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const fs = require("fs");
const path = require("path");

const config = getDefaultConfig(__dirname);

// npm v7+ will install ../node_modules/react-native because of peerDependencies.
// To prevent the incompatible react-native bewtween ./node_modules/react-native and ../node_modules/react-native,
// excludes the one from the parent folder when bundling.
config.resolver.blockList = [
  ...Array.from(config.resolver.blockList ?? []),
  new RegExp(
    // TODO: escaping
    path.join("@motiz88", "react-native-midi", "node_modules", "react-native") +
      path.sep
  ),
];

config.resolver.nodeModulesPaths = [path.resolve(__dirname, "./node_modules")];

// Hack to make Metro follow the symlink to @motiz88/react-native-midi if it exists.
const REACT_NATIVE_MIDI = path.resolve(
  __dirname,
  "node_modules",
  "@motiz88",
  "react-native-midi"
);
config.watchFolders = [];
if (fs.lstatSync(REACT_NATIVE_MIDI).isSymbolicLink()) {
  const rnmidiRealPath = fs.realpathSync(REACT_NATIVE_MIDI);
  config.watchFolders.push(rnmidiRealPath);
  config.resolver.blockList.push(
    new RegExp(
      // TODO: escaping
      path.join(rnmidiRealPath, "node_modules", "react-native") + path.sep
    )
  );
}

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;
