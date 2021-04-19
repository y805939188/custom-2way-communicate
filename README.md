b# 使用非 WebSocket 的方式实现双向即时通信
---
> 参考 k8s 的 list-watch 机制

体验方式:</br>
> 1. npm install
> 2. npm intall -g http-server
> 3. http-server -p ${your-port} ./
> 4. node ./test/server/index.js
> 5. 同时打开浏览器两个窗口, 分别访问 http://localhost:${your-port}/test/client/client1 以及 http://localhost:${your-port}/test/client/client2
