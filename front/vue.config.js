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
    menu: {
      entry: "src/main.js",
      template: "public/pages/index.html",
      filename: "pages/menu.html",
      title: "メニュー",
    },
    clientsList: {
      entry: "src/main.js",
      template: "public/pages/index.html",
      filename: "pages/clients/list.html",
      title: "顧客情報一覧",
    },
    clientsCreate: {
      entry: "src/main.js",
      template: "public/pages/index.html",
      filename: "pages/clients/create.html",
      title: "顧客情報登録",
    },
    clientsEdit: {
      entry: "src/main.js",
      template: "public/pages/index.html",
      filename: "pages/clients/edit.html",
      title: "顧客情報修正",
    },
    clientsDelete: {
      entry: "src/main.js",
      template: "public/pages/index.html",
      filename: "pages/clients/delete.html",
      title: "顧客情報削除",
    },
    ordersList: {
      entry: "src/main.js",
      template: "public/pages/index.html",
      filename: "pages/orders/list.html",
      title: "受注情報一覧",
    },
    ordersCreate: {
      entry: "src/main.js",
      template: "public/pages/index.html",
      filename: "pages/orders/create.html",
      title: "受注情報登録",
    },
    ordersEdit: {
      entry: "src/main.js",
      template: "public/pages/index.html",
      filename: "pages/orders/edit.html",
      title: "受注情報修正",
    },
    ordersDelete: {
      entry: "src/main.js",
      template: "public/pages/index.html",
      filename: "pages/orders/delete.html",
      title: "受注情報削除",
    },
    productsList: {
      entry: "src/main.js",
      template: "public/pages/index.html",
      filename: "pages/products/list.html",
      title: "商品情報一覧",
    },
    productsCreate: {
      entry: "src/main.js",
      template: "public/pages/index.html",
      filename: "pages/products/create.html",
      title: "商品情報登録",
    },
    productsEdit: {
      entry: "src/main.js",
      template: "public/pages/index.html",
      filename: "pages/products/edit.html",
      title: "商品情報修正",
    },
    productsDelete: {
      entry: "src/main.js",
      template: "public/pages/index.html",
      filename: "pages/products/delete.html",
      title: "商品情報削除",
    },
    usersList: {
      entry: "src/main.js",
      template: "public/pages/index.html",
      filename: "pages/users/list.html",
      title: "ユーザー情報一覧",
    },
    usersCreate: {
      entry: "src/main.js",
      template: "public/pages/index.html",
      filename: "pages/users/create.html",
      title: "ユーザー情報登録",
    },
    usersEdit: {
      entry: "src/main.js",
      template: "public/pages/index.html",
      filename: "pages/users/edit.html",
      title: "ユーザー情報修正",
    },
    usersDelete: {
      entry: "src/main.js",
      template: "public/pages/index.html",
      filename: "pages/users/delete.html",
      title: "ユーザー情報削除",
    },
    sorry: {
      entry: "src/main.js",
      template: "public/pages/index.html",
      filename: "pages/sorry.html",
      title: "Sorry",
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
