# vue-auth-gate [![NPM Version][npm-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/vue-auth-gate.svg
[npm-url]: https://npmjs.org/package/vue-auth-gate
🌱 基于 vue3 + axios + vue-router 实现权限验证.

## 安装

```shell
npm i vue-auth-gate -S
```

## 使用
```javascript
// main.js

import authGate from 'vue-auth-gate'
// 路由实例
import router from './router'
// axios实例
import { http } from './http';
// 初始化app
const app = createApp(App);

// 🌱 验证开始
const permissionRoutes = [];
console.log(http);
authGate({
    router,
    axios:http,

    // 路由切换时执行,
    // 注意这里是异步函数,
    // 也就是要求返回值是promise<boolean>,
    // 当返回false的时候跳转到404
    // 返回true才允许路由跳转
    async isAuth(to) {
        if (null === permissionRoutes) {
            await http.get('/permission').then(data => {
                // permissionRoutes === ['/user', '/role','/xxx']
                permissionRoutes = data.data.routes;
            })
        }
        return permissionRoutes.some(path => path === to.matched[to.matched.length - 1].path)
    },

    // 配置404页面
    component404: () => import('@/views/404.vue'),

});
```