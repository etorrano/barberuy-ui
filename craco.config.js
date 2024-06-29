const { loaderByName, addBeforeLoader } = require("@craco/craco");

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      const fileLoader = {
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[contenthash].[ext]",
              outputPath: "asets",
              esModule: false,
            },
          },
        ],
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        exclude: /node_modules/,
      };

      addBeforeLoader(webpackConfig, loaderByName("babel-loader"), fileLoader);
      return webpackConfig;
    },
  },
};
