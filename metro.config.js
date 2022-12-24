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

const LINKABLE_PACKAGES = ["@motiz88/react-native-midi"];

// Hack to make Metro follow symlinks to certain packages if they exist.
config.watchFolders = [];

for (const packageName of LINKABLE_PACKAGES) {
  const localPath = path.resolve(__dirname, "node_modules", packageName);
  if (fs.lstatSync(localPath).isSymbolicLink()) {
    const realPath = fs.realpathSync(localPath);
    config.watchFolders.push(realPath);

    // Just in case the linked package has its own react-native installed.
    // TODO: Invert this and force-resolve `react-native` to a single copy instead.
    config.resolver.blockList.push(
      new RegExp(
        // TODO: escaping
        path.join(realPath, "node_modules", "react-native") + path.sep
      )
    );
  }
}

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;
