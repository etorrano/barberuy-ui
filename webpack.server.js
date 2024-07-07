const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: "./server/index.ts",
  mode: "production",
  target: "node",
  externals: [nodeExternals()],
  plugins: [
    new MiniCssExtractPlugin({
      linkType: "text/css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs|tsx|ts)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                /* {
                  targets: {
                    node: 12,
                  },
                }, */
              ],
              "@babel/preset-react",
              ["@babel/preset-typescript", { allowNamespaces: true }],
            ],
            plugins: [
              "@babel/plugin-syntax-dynamic-import",
              "@babel/plugin-proposal-private-property-in-object",
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },

      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[hash:20].[ext]",
              outputPath: "/static/media",
              publicPath: "/static/media",
              esModule: false, // <- here
            },
          },
        ],
      },

      /*   {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      }, */
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".scss", ".png", ".css"],
  },
  output: {
    filename: "server.js",
    path: path.resolve(__dirname, "server"),
    library: "index",
    libraryTarget: "umd",
  },
};
