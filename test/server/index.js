const ListWatch = require('../../list-watch/service');

const PORT = 3000;

const ls = new ListWatch();

ls.onopen('/ding/test', (isOk) => {
  isOk && console.log('success'); 
})

ls.listen(PORT, () => console.log(`正在监听 ${PORT} 端口`));
