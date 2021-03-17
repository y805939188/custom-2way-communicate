const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');

class ListWatch {
  headers = {
    'Transfer-Encoding': 'chunked',
    'Content-Type':'text/plain; charset=UTF-8',
    'x-content-type-options':'nosniff',
  };
  watcherList = [];

  SUCCESS_CODE = 200;
  __MAGIC_PRIVATE_STRING__ = 'magic-private-list-watch';
  OPEN_TAG = `${this.__MAGIC_PRIVATE_STRING__}_on_open_tag`;
  CLIENT_REGISTER_SUFFIX = `${this.__MAGIC_PRIVATE_STRING__}_client_register_route_suffix`;
  CLIENT_MESSAGE_RECEIVE = `${this.__MAGIC_PRIVATE_STRING__}_client_message_receive`;

  constructor() {
    this.app = express();
    this.app.use(cors());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
  }

  onopen = (watchId, callback) => {
    this._watchId = watchId;
    this.app.get(watchId, (req, res) => {
      const resourceVersion = { current: 0 };
      res.writeHead(this.SUCCESS_CODE, this.headers);
      res.write(`${this.OPEN_TAG}/${resourceVersion.current}\r\n`); // 触发客户端 onopen

      const _origin_write = res.write;      
      res.write = (...args) => {
        resourceVersion.current++;
        args[0] = `${this.OPEN_TAG}/${resourceVersion.current}/${args[0]}\r\n`;
        _origin_write.apply(res, args);
      }

      const { clientId } = req.query;
      const currentClient = this.watcherList.find((watcher) => (watcher.clientId === clientId));
      currentClient.response = res;
      callback('ok'); 
    });

    this.app.post(`${watchId}/${this.CLIENT_REGISTER_SUFFIX}`, (req, res) => {
      const { clientId } = req.body;
      this.watcherList.push({ clientId, response: null });
      res.send('ok');
    });

    this.app.post(`${watchId}/${this.CLIENT_MESSAGE_RECEIVE}`, (req, res) => {
      const { clientId, message } = req.body;
      console.log(clientId, ":", message)
      const otherWatchers = this.watcherList.filter((watcher) => (watcher.clientId !== clientId));
      otherWatchers.forEach((watcher) => (watcher.response.write(message)));
      res.end();
    });
  }

  listen = (...args) => this.app.listen(...args);
};

module.exports = ListWatch;
