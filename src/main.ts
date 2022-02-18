import { createApp } from 'vue';
import App from './App.vue';
import router from './router'
import { Button, Input, Checkbox, Tabs } from "ant-design-vue";

const app = createApp(App);

app.use(Button).use(Input).use(Checkbox).use(Tabs).use(router).mount('#app');