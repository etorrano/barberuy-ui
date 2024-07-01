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
              outputPath: "static/media",
              publicPath: "static/media",
              esModule: false,
            },
          },
          {
            loader: "image-webpack-loader",
            options: {
              mozjpeg: {
                progressive: false,
                quality: 10,
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: "65-90",
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75,
              },
            },
          },
        ],
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        exclude: /node_modules/,
      };
      webpackConfig.module.rules = webpackConfig.module.rules.map((rule) => {
        if (rule.oneOf) {
          rule.oneOf = rule.oneOf.filter(
            (subRule) =>
              !(
                subRule.test &&
                subRule.test.toString().includes("png|jpe?g|gif")
              )
          );
          rule.oneOf.push(fileLoader);
        }
        return rule;
      });
      //webpackConfig.module.rules.splice(0, 0, fileLoader);
      /*       addBeforeLoader(webpackConfig, loaderByName("babel-loader"), fileLoader); */
      return webpackConfig;
    },
  },
};
