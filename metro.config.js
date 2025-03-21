const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Modify the resolver to support SVG transformation
defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts.filter(
  ext => ext !== 'svg',
);
defaultConfig.resolver.sourceExts = [
  ...defaultConfig.resolver.sourceExts,
  'svg',
];
defaultConfig.transformer.babelTransformerPath = require.resolve(
  'react-native-svg-transformer',
);

module.exports = mergeConfig(defaultConfig, {});
