const path = require("path");

module.exports = {
  entry: "./server/lambda-edge-server.tsx",
  mode: "production",
  target: "node",
  externals: [],
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    node: 12,
                  },
                },
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
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "commonjs",
  },
};
