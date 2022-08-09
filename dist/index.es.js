/*!
 * v-gate.js v0.0.1
 * (c) 2022-2022 Russell
 * https://github.com/any86/v-gate
 * Released under the MIT License.
 */
import progress from 'nprogress';
import 'nprogress/nprogress.css';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const NOOP = () => void 0;
const NAME_404 = '404';
let LOCAL_TOKEN_NAME = '__auth__token';
let HTTP_TOKEN_NAME = 'Authorization';
let http;
const DEFAULT_OPTIONS = {
    onNoToken: NOOP,
    onError: NOOP,
    tokenName: LOCAL_TOKEN_NAME,
    httpTokenName: HTTP_TOKEN_NAME,
    pathLogin: '/login',
    path404: '/404',
    whiteList: ['/error', '/404', '/success', '/fail',],
};
function index (options) {
    const { router, axios, whiteList, pathLogin, path404, isAuth, onNoToken, onError, component404, tokenName, httpTokenName } = Object.assign(Object.assign({}, DEFAULT_OPTIONS), options);
    whiteList.push(pathLogin);
    http = axios;
    LOCAL_TOKEN_NAME = tokenName;
    HTTP_TOKEN_NAME = httpTokenName;
    if (component404) {
        router.addRoute({ path: '/:pathMatch(.*)*', name: NAME_404, component: component404 });
    }
    router.onError(() => {
        router.push({ name: NAME_404 });
    });
    router.beforeEach((to) => __awaiter(this, void 0, void 0, function* () {
        progress.start();
        const token = getToken();
        setHttpToken(token);
        if (!whiteList.includes(to.path)) {
            if (!token) {
                onNoToken();
                return { path: pathLogin };
            }
            try {
                if (NAME_404 !== to.name && !(yield isAuth(to, token))) {
                    throw 0;
                }
            }
            catch (error) {
                onError(error);
                router.replace({ path: path404 });
            }
        }
    }));
    router.afterEach(() => {
        progress.done();
    });
    http.interceptors.response.use(function (response) {
        return response;
    }, function (error) {
        if (401 === error.response.status) {
            router.push({ path: pathLogin });
        }
        return Promise.reject(error);
    });
    return { progress };
}
const saveToken = (token) => {
    localStorage.setItem(LOCAL_TOKEN_NAME, token);
    setHttpToken(token);
};
function clearToken() {
    localStorage.removeItem(LOCAL_TOKEN_NAME);
    Reflect.deleteProperty(http.defaults.headers.common, HTTP_TOKEN_NAME);
}
const logout = clearToken;
function getToken() {
    return localStorage.getItem(LOCAL_TOKEN_NAME) || '';
}
function setHttpToken(token) {
    http.defaults.headers.common[HTTP_TOKEN_NAME] = token;
}

export { clearToken, index as default, getToken, logout, saveToken };
//# sourceMappingURL=index.es.js.map
