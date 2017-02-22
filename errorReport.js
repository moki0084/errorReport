+ function () {
            var report = {}
            //随机数减少记录重复的错误日志
            report.need = (function () {
                return Math.random() > 0.5
            })();
            //ajax 封装
            report.send = function (obj) {
                var xhr = (function () {
                    if (typeof XMLHttpRequest != 'undefined') {
                        return new XMLHttpRequest();
                    } else if (typeof ActiveXObject != 'undefined') {
                        var version = ['MSXML2.XMLHttp.6.0', 'MSXML2.XMLHttp.3.0', 'MSXML2.XMLHttp'];
                        try {
                            for (var i in version) {
                                return new ActiveXObject(version[i]);
                            }
                        } catch (e) {}
                    } else {
                        throw new Error('您的系统或浏览器不支持XHR对象！');
                        return false;
                    }
                })();
                obj.method = obj.method || 'get';
                obj.async = obj.async || false;
                obj.success = obj.success || function () {};
                obj.data = obj.data || {};
                obj.url = obj.url + '?rand=' + Math.random();
                obj.data = (function (data) {
                    var arr = [];
                    for (var i in data) {
                        if (Object.prototype.hasOwnProperty.call(data, i)) {
                            arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
                        }
                    }
                    return arr.join("&");
                })(obj.data);

                if (obj.method == 'get') {
                    obj.url += obj.url.indexOf('?') == -1 ? '?' + obj.data : '&' + obj.data;
                }
                if (obj.async == true) {
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == 4) {
                            callback();
                        }
                    };
                }
                xhr.open(obj.method, obj.url, obj.async);
                if (obj.method == 'post') {
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    xhr.send(obj.data);
                } else {
                    xhr.send(null);
                }
                if (obj.async === false) {
                    callback();
                }

                function callback() {
                    if (xhr.status == 200) {
                        obj.success(xhr.responseText);
                    } else {
                        console.log('获取数据错误！错误代号：' + xhr.status + '，错误信息：' + xhr.statusText);
                    }
                }

            };
            report.bindEvent = function () {
                //url为空的数据都不记录,记录也无法定位

                //监控脚本错误
                window.onerror = function (msg, url, line, col, error) {
                    if (msg != "Script error." && !url) {
                        return true;
                    }
                    setTimeout(function () {
                        var data = {};
                        col = col || (window.event && window.event.errorCharacter) || 0;
                        data.url = url;
                        data.line = line;
                        data.col = col;
                        data.type = "javascript"
                        if (!!error && !!error.stack) {
                            data.msg = error.stack.toString();
                        } else if (!!arguments.callee) {
                            var ext = [];
                            var f = arguments.callee.caller,
                                c = 3;
                            while (f && (--c > 0)) {
                                ext.push(f.toString());
                                if (f === f.caller) {
                                    break;
                                }
                                f = f.caller;
                            }
                            ext = ext.join(",");
                            data.msg = ext;
                        }
                        // report.send({
                        //     url: '/',
                        //     data: data
                        // })
                    }, 50);
                    return true;
                };
                if (window.addEventListener) {
                    //监控资源加载错误
                    window.addEventListener('error', function (e) {
                        if (e.srcElement && e.srcElement.nodeName) {
                            setTimeout(function () {
                                var node = e.srcElement,
                                    nodeName = node.nodeName.toLowerCase(),
                                    data = {
                                        type: 'load',
                                        node: nodeName
                                    }
                                switch (nodeName) {
                                    case "img":
                                        {
                                            if (node.className.indexOf('lazy') == -1) {
                                                data.url = node.src
                                            }
                                            break;
                                        }
                                    case "script":
                                        {
                                            data.url = node.src;
                                            break;
                                        }
                                    case "link":
                                        {
                                            data.url = node.href;
                                            break;
                                        }
                                }

                                if (data.url) {
                                    //上报到后台
                                    // report.send({
                                    //     url: '/',
                                    //     data: data
                                    // })
                                }
                            }, 50)
                        }
                        return true;
                    }, true)
                }

            };
            report.init = function () {
                if (report.need) {
                    report.bindEvent();
                }
            }
            report.init();
            window.ERRORREPORT = report;
        }();