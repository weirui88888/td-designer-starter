/* eslint-disable simple-import-sort/imports */
import { createApp } from 'vue';
import TDesign from 'tdesign-vue-next';
import TDesignChat from '@tdesign-vue-next/chat'; // 引入chat组件

import App from './App.vue';
import router from './router';
import { store } from './store';
import i18n from './locales';

import 'tdesign-vue-next/es/style/index.css';
import '@/style/index.less';
import './permission';

const app = createApp(App);

app.use(TDesign);
app.use(TDesignChat);
app.use(store);
app.use(router);
app.use(i18n);

app.mount('#app');
