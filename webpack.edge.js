const path = require("path");
const imageInlineSizeLimit = parseInt(
  process.env.IMAGE_INLINE_SIZE_LIMIT || "10000"
);

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
      // "url" loader works like "file" loader except that it embeds assets
      // smaller than specified limit in bytes as data URLs to avoid requests.
      // A missing `test` is equivalent to a match.
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
      /*  {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: imageInlineSizeLimit,
          },
        },
      }, */
      /* {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
            },
          },
        ],
      }, */
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
