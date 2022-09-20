const { HotModuleReplacementPlugin } = require('webpack');
const { MFLiveReloadPlugin } = require("@module-federation/fmr");
const deps = require("./package.json").dependencies;
const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require("path");

const rulesForJs = {
  test: /\.(js|jsx)$/,
  loader: "babel-loader",
  exclude: /node_modules/
};


const rulesForCss = {
  test: /\.(css|s[ac]ss)$/i,
  use: ["style-loader", "css-loader", "postcss-loader"],
};

const rulesForFiles = {
  test: /\.(eot|ttf|woff|woff2|png|jpe?g|gif|svg)$/i,
  use: [
    {
      loader: "file-loader",
    },
  ],
};

const rulesFoJsAuto = {
  test: /\.m?js/,
  type: "javascript/auto",
  resolve: {
    fullySpecified: false,
  },
}

const rules = [rulesForJs, rulesFoJsAuto, rulesForCss, rulesForFiles];


module.exports = (env, arg) => {
  const { mode } = arg;
  const isProduction = mode === "production";
  return {
    output: {
      filename: isProduction ? "[name].[contenthash].js" : "index.js",
      path: path.resolve(__dirname, "build")
    },

    devtool: "source-map",

    resolve: {
      extensions: [".jsx", ".js", ".json"],
    },

    devServer: {
      port: 3003,
      open: true,
      historyApiFallback: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
      },
    },


    module: { rules },


    plugins: [
     /*  new HotModuleReplacementPlugin(),
      new MFLiveReloadPlugin({
        port: 3001,
        container: "clothes",
        standalone: false,
      }), */
      new ModuleFederationPlugin({
        name: "register_page",
        filename: "remoteEntry.js",
        remotes: {
          "app_container": "app_container@https://ifrainmedinagarcia.github.io/app_container_devschool/remoteEntry.js",
          //"app_container": "app_container@http://localhost:3000/remoteEntry.js",
        },
        exposes: {
          "./App": "./src/App"
        },
        shared: {
          ...deps,
          react: {
            singleton: true,
            requiredVersion: deps.react,
          },
          "react-dom": {
            singleton: true,
            requiredVersion: deps["react-dom"],
          },
        },
      }),
      new HtmlWebPackPlugin({
        template: "./public/index.html",
        filename: "./index.html",
      }),
    ],

  }
};
