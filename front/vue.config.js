module.exports = {
  publicPath: "/public",
  outputDir: "dist",
  assetsDir: "assets",
  runtimeCompiler: true,
  productionSourceMap: false,
  parallel: true,
  css: {
    modules: false,
    extract: true,
    sourceMap: true,
  },
  lintOnSave: true,
  pages: {
    logIn: {
      entry: "src/main.js",
      template: "public/pages/index.html",
      filename: "pages/log-in.html",
      title: "ログイン",
    },
    logOut: {
      entry: "src/main.js",
      template: "public/pages/index.html",
      filename: "pages/log-out.html",
      title: "ログアウト",
    },
    menu: {
      entry: "src/main.js",
      template: "public/pages/index.html",
      filename: "pages/menu.html",
      title: "メニュー",
    },
    header: {
      entry: "src/main.js",
      template: "public/pages/index.html",
      filename: "pages/header.html",
      title: "ヘッダー",
    },
  },
  devServer: {
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  /*
  configureWebpack: {
    devtool: "source-map",
  },
  */
};
