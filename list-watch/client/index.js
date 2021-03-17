import ajax from '/list-watch/client/ajax.js';

class ListWatcher {
  __MAGIC_PRIVATE_STRING__ = 'magic-private-list-watch';
  OPEN_TAG = `${this.__MAGIC_PRIVATE_STRING__}_on_open_tag`;
  CLIENT_REGISTER_SUFFIX = `${this.__MAGIC_PRIVATE_STRING__}_client_register_route_suffix`;
  CLIENT_MESSAGE_RECEIVE = `${this.__MAGIC_PRIVATE_STRING__}_client_message_receive`;

  constructor(baseUrl) {
    this.opened = false;
    this.baseUrl = baseUrl;
    this.ajax = ajax;
    this.clientId = `${+new Date()}_${(Math.random() * 10000) | 0}`;
    this.cacheResponseText = '';
  }

  onopen = (serverId, callback) => {
    this.serverId = serverId;
    this
      .ajax()
      .post(`${this.baseUrl}${serverId}/${this.CLIENT_REGISTER_SUFFIX}`)
      .data({ clientId: this.clientId })
      .callback((msg) => (msg === 'ok' && this._connect(callback)))
      .send();
  }

  _connect = (callback) => {
    this
      .ajax()
      .get(`${this.baseUrl}${this.serverId}`)
      .data({ clientId: this.clientId })
      .callback((msg) => {
        if (msg) {
          const _msg = msg.replace(this.cacheResponseText, '').replace('\r\n', '').split('/');
          this.cacheResponseText = msg;
          const [ _magic_tag_, resourceVersion, currentMsg ] = _msg;
          if (_magic_tag_ !== this.OPEN_TAG) return console.log('response msg err, invaild list watch format');
          if (callback) {
            callback('ok');
            callback = null;
            this.opened = true;
          } else {
            console.log(12345, currentMsg);
            console.log(56789, currentMsg.replace('\"', ''));
            this._onmessage && this._onmessage(currentMsg.replaceAll('\"', ''));
          }
        }
      })
      .send()
  }

  onmessage = (callback) => {
    this._onmessage = callback;
  }

  send = (msg) => {
    this
      .ajax()
      .post(`${this.baseUrl}${this.serverId}/${this.CLIENT_MESSAGE_RECEIVE}`)
      .data({ clientId: this.clientId, message: msg })
      .send()
  }
}

export default ListWatcher;
