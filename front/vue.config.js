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
    signIn: {
      entry: "src/main.js",
      template: "public/pages/index.html",
      filename: "pages/sign-in.html",
      title: "サインイン",
    },
    signOut: {
      entry: "src/main.js",
      template: "public/pages/index.html",
      filename: "pages/sign-out.html",
      title: "サインアウト",
    },
    top: {
      entry: "src/main.js",
      template: "public/pages/index.html",
      filename: "pages/top.html",
      title: "トップページ",
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
