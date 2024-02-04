const rspack = require("@rspack/core");
const refreshPlugin = require("@rspack/plugin-react-refresh");
const { DotenvPlugin } = require("rspack-plugin-dotenv");
const isDev = process.env.NODE_ENV === "development";
const deps = require("./package.json").dependencies;
/**
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = {
  context: __dirname,
  entry: {
    main: "./src/main.tsx",
  },
  output: {
    uniqueName: "chat",
  },
  resolve: {
    extensions: ["...", ".ts", ".tsx", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        type: "asset",
      },
      {
        test: /\.(jsx?|tsx?)$/,
        use: [
          {
            loader: "builtin:swc-loader",
            options: {
              sourceMap: true,
              jsc: {
                parser: {
                  syntax: "typescript",
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: "automatic",
                    development: isDev,
                    refresh: isDev,
                  },
                },
              },
              env: {
                targets: [
                  "chrome >= 87",
                  "edge >= 88",
                  "firefox >= 78",
                  "safari >= 14",
                ],
              },
            },
          },
        ],
      },
    ],
  },
  devServer: {
    port: 8082,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  plugins: [
    new rspack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    }),
    new rspack.ProgressPlugin({}),
    new rspack.HtmlRspackPlugin({
      template: "./index.html",
    }),
    new DotenvPlugin(),
    new rspack.container.ModuleFederationPlugin({
      name: "chat",
      filename: "remoteEntry.js",
      exposes: {
        "./Chat": "./src/App.tsx",
      },
      shared: {
        react: {
          requiredVersion: deps["react"],
          singleton: true,
        },
      },
    }),
    isDev ? new refreshPlugin() : null,
  ].filter(Boolean),
};
