import {defineConfig} from 'rollup'
import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';

// 代码头
const banner =
    `/*!
 * vue-auth-gate.js v${pkg.version}
 * (c) 2022-${new Date().getFullYear()} Russell
 * https://github.com/any86/vue-auth-gate
 * Released under the MIT License.
 */`

export default defineConfig({
    input: './src/index.ts',
    external:['vue','axios','nprogress','nprogress/nprogress.css','vue-router'],
    plugins: [
        typescript({
            exclude: 'node_modules/**',
        }),
    ],
    output: [{
            format: 'cjs',
            file: pkg.main, 
            banner,
            sourcemap: true
        },
        {
            format: 'es',
            file: pkg.module,
            banner,
            sourcemap: true
        },
        // {
        //     format: 'umd',
        //     name: 'vAuth',
        //     file: pkg.browser,
        //     banner,
        //     sourcemap: true
        // }
    ]
});