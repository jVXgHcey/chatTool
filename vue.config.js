const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

const CDNPATH = process.env.CDNPATH;

module.exports = {
  publicPath: CDNPATH || "/",
  lintOnSave: true,
  outputDir: "dist",
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/css/global.scss";`,
        sassOptions: {
          outputStyle: "expanded",
        },
      },
    },
  },
  devServer: {
    proxy: {
      "/api": {
        target: "http://fapi.it965.com",
        changeOrigin: true,
      },
      "/chatNodeServices": {
        target: "http://fct.it965.com",
        changeOrigin: true,
      },
    },
  },
  chainWebpack: (config) => {
    config.resolve.alias.set(
      "@components",
      path.resolve(__dirname, "./src/components")
    );
    config.resolve.alias.set("@", path.resolve(__dirname, "./src"));
    config.resolve.alias.set(
      "#",
      path.resolve(__dirname, "./src/assets/utils")
    );

    if (process.env.use_analyzer) {
      config
        .plugin("webpack-bundle-analyzer")
        .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin);
    }
    config.plugin("define").tap((args) => {
      const env = args[0]["process.env"];
      if (process.env.ApiSecret) {
        env.ApiSecret = JSON.stringify(process.env.ApiSecret);
      }
      return args;
    });
  },
  configureWebpack: {
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true, //
              pure_funcs: ["console.log"], //
            },
          },
        }),
      ],
    },
  },
};
