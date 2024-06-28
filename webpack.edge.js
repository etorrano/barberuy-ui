const path = require("path");

module.exports = {
  entry: "./server/lambda-edge-server.tsx",
  mode: "production",
  target: "node",
  externals: [],
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs|tsx|ts)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-env"],
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
    extensions: [".tsx", ".ts", ".js", ".scss", ".png", ".css"],
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist/edge"),
    library: "index",
    libraryTarget: "umd",
  },
};
