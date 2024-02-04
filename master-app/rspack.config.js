const rspack = require("@rspack/core");
const refreshPlugin = require("@rspack/plugin-react-refresh");
const isDev = process.env.NODE_ENV === "development";
// const deps = require("./package.json").dependencies;

function lazyLoadRemote(remoteUrl, appName) {
  return `promise new Promise(resolve => {
	  const script = document.createElement('script')
	  script.src = '${remoteUrl}'
	
	  console.log('lazyLoadRemote', script.src);
	
	  script.onload = () => {
		// the injected script has loaded and is available on window
		// we can now resolve this Promise
		const proxy = {
		  get: (request) => window.${appName}.get(request),
		  init: (arg) => {
			try {
			  return window.${appName}.init(arg)
			} catch(e) {
			  console.log('remote container already initialized', e)
			}
		  }
		}
		resolve(proxy)
	  }
	  // inject this script with the src set to the versioned remoteEntry.js
	  document.head.appendChild(script);
	})`;
}

/**
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = {
  context: __dirname,
  entry: {
    main: "./src/main.tsx",
  },
  output: {
    // set uniqueName explicitly to make react-refresh works
    uniqueName: "master-app",
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
  plugins: [
    new rspack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    }),
    new rspack.ProgressPlugin({}),
    new rspack.HtmlRspackPlugin({
      template: "./index.html",
    }),
    new rspack.container.ModuleFederationPlugin({
      name: "master-app",
      remotes: {
        messageList: lazyLoadRemote(
          "http://localhost:8081/remoteEntry.js",
          "messageList"
        ),
        chat: lazyLoadRemote("http://localhost:8082/remoteEntry.js", "chat"),
      },
      shared: {
        react: {
          singleton: true,
        },
      },
    }),
    isDev ? new refreshPlugin() : null,
  ].filter(Boolean),
};
