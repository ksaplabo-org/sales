/*
import Vue from "vue";

// import JQuery(for Bootstrap etc)
import jQuery from "jquery";
global.jquery = jQuery;
global.$ = jQuery;
window.$ = window.jQuery = require("jquery");

import "jquery.easing";

// import Bootstrap(for design)
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";

// import fortawesome(for https://startbootstrap.com/ template this is licenced by MIT)
import "@fortawesome/fontawesome-free/css/all.min.css";
import "datatables.net-bs4/css/dataTables.bootstrap4.css";

// import b-table
import BootstrapVue from "bootstrap-vue";
*/

import "@/utils/sb-admin";
import "@/css/common.css";
import "@/css/sb-admin.min.css";

import "@fortawesome/fontawesome-free/css/all.min.css";

import App from "./App.vue";
import router from "./router";
import { createApp } from "vue";

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';
import { createBootstrap } from 'bootstrap-vue-next'

const app = createApp(App);
app.use(router);
app.use(createBootstrap());
app.mount("#app");
