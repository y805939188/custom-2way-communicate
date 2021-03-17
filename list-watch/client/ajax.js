const ajax = () => {
  return {
    _method: null,
    _data: null,
    _xhr: new XMLHttpRequest(),
    _callback: [],
    _getQuery: (data) => Object.entries(data).reduce((a, b) => (b ? (a ? `${a}&${b[0]}=${JSON.stringify(b[1])}` : `${b[0]}=${JSON.stringify(b[1])}`) : a  ), ''),

    send: function() {
      this._method === 'GET' && this._xhr.open(this._method, this._url, true);
      this._method === 'GET' ? this._xhr.send() : this._xhr.send(this._getQuery(this._data));
      this._xhr.onreadystatechange = () => {
        if (this._xhr.readyState === 3 || this._xhr.readyState === 4) {
          if ( this._xhr.status == 200 ) {
            this._callback.length && this._callback.forEach((cb) => cb(this._xhr.responseText));
          }
        }
      }
    },

    data: function(data) {
      this._data = data;
      if (this._method && this._method === 'GET') {
        this._url = `${this._url}?${this._getQuery(data)}`;
      }
      return this;
    },

    get: function(url) {
      this._url = url;
      this._method = 'GET';
      return this;
    },
    post: function(url) {
      this._url = url;
      this._method = 'POST';
      this._xhr.open(this._method, this._url, true);
      this._xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
      return this;
    },
    callback: function(cb) {
      this._callback.push(cb);
      return this;
    }
  }
};

export default ajax;
