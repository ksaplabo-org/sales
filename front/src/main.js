import "@/utils/sb-admin";
import "@/css/common.css";
import "@/css/sb-admin.min.css";

import "@fortawesome/fontawesome-free/css/all.min.css";

import App from "./App.vue";
import router from "./router";
import { createApp } from "vue";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';

import { createBootstrap } from 'bootstrap-vue-next';

const app = createApp(App);
app.use(createBootstrap());
app.use(router);
app.mount("#app");
