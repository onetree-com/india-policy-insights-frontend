const webpack = require("webpack");
const CracoWorkboxPlugin = require("craco-workbox");
const FilterWarningsPlugin = require("webpack-filter-warnings-plugin");

module.exports = function override(config, _) {
  config = {
    babel: {
      loaderOptions: {
        ignore: ["./node_modules/maplibre-gl/dist/maplibre-gl.js"],
      },
    },
    plugins: [
      {
        plugin: CracoWorkboxPlugin,
      },
    ],
    webpack: {
      alias: {
        "mapbox-gl": "maplibre-gl",
      },
      devServer: {
        client: {
          overlay: { errors: true, warnings: false, runtimeErrors: false },
        },
      },
      configure: {
        resolve: {
          fallback: {
            process: require.resolve("process/browser"),
            zlib: require.resolve("browserify-zlib"),
            stream: require.resolve("stream-browserify"),
            util: require.resolve("util"),
            buffer: require.resolve("buffer"),
            asset: require.resolve("assert"),
          },
        },
        plugins: [
          new webpack.ProvidePlugin({
            Buffer: ["buffer", "Buffer"],
            process: "process/browser",
          }),
          new FilterWarningsPlugin({
            exclude:
              /mini-css-extract-plugin[^]*Conflicting order. Following module has been added:/,
          }),
        ],
      },
    },
  };
  return config;
};
