# v-gate [![NPM Version][npm-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/v-gate.svg
[npm-url]: https://npmjs.org/package/v-gate
🌱 基于 vue3 + axios + vue-router 实现权限验证.

## 安装

```shell
npm i -S v-gate
```

## 使用
```javascript
// main.js

import VGate from 'v-gate'
// 路由实例
import router from './router'
// axios实例
import { http } from './http';
// 初始化app
const app = createApp(App);

// 🌱 验证开始
// 初始化路由拉取一次权限列表,
// 之后每次切换路由进行权限校验
// 我这里"/permission"存的是['/user','/role']一类的路径,
// 可按实际需要修改
const permissionRoutes = [];
VGate({
    // 路由实例
    router,

    // axios实例
    axios:http,

    // 路由切换时执行,
    // 注意这里是异步函数,
    // 也就是要求返回值是promise<boolean>,
    // 当返回false的时候跳转到404
    // 返回true才允许路由跳转
    async isAuth(to) {
        if (null === permissionRoutes) {
            await http.get('/permission').then(data => {
                permissionRoutes = data.data.routes;
            })
        }
        // permissionRoutes == ['/user', '/role','/xxx']
        return permissionRoutes!.some(path => path === to.matched[to.matched.length - 1].path)
    },

    // 配置404页面
    component404: () => import('@/views/404.vue'),

});
```