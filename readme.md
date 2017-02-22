引入 errorReopt.js，会自动捕获文件下载失败与 js 中的错误，捕获 js 错误需要配置跨域。

#### 使用方式:

在所有加载资源之前引入 errorReopt.js
    <script src="errorReopt.js" crossorigin></script>


#### 主动判断或捕获错误

```js
if(flag){
    ERRORREPORT.send({
        url: '/',
        data: {
            msg: 'test.js Function run',
            type: 'run error'
        }
    })
}

try {
  // code...
} catch(e){
  ERRORREPORT.send();
}

```

#### 捕获 js 中的报错

 浏览器为了避免数据泄露到不安全的域中,会统一返回 Script error。

 解决方案是配置文件跨域,服务器也设置 Access-Control-Allow-Origin 的响应头：header('Access-Control-Allow-Origin: *');

```js
    <script src="http://localhost/test.js" crossorigin></script>
```

window.onerror , addEventListener 都会执行,重复注册都只会执行一次

#### Source Map解析

普遍线上代码都压缩了,需要解析Source Map 才可以正确的定位,
- 可视化解析 http://sokra.github.io/source-map-visualization/
- 官方解析库 https://github.com/mozilla/source-map
- 它相比官方的库性能更高、具有更智能的推导功能   https://github.com/digojs/source-map-builder