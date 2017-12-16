const axios = require('axios')
const EventEmitter = require('events')
/**
 * OrientDB Connection
 *
 * @constructor
 * @parent EventEmitter
 */
 const defaultConfig={
   user: 'root',
   password: 'root_passwd',
   host: 'http://127.0.0.1:2480',
   database: 'GratefulDeadConcerts',
}
class Connection extends EventEmitter{
  constructor(config) {
    super(config)
    this.user=config.user || defaultConfig.user
    this.password=config.password || defaultConfig.password
    this.host=config.host || defaultConfig.host
    this.database=config.database || defaultConfig.database

    const authHeader=Buffer.from(this.user+':'+this.password).toString('base64')
    this._axios = axios.create({
      // 5 minutes sec timeout
      timeout: 60*1000*5,
      //follow up to 10 HTTP 3xx redirects
      maxRedirects: 10,
      //cap the maximum content length we'll accept to 50MBs, just in case
      maxContentLength: 50 * 1000 * 1000,
      // withCredentials: true,
      // auth: {
      //   user: this.user,
      //   pass: this.password,
      // },
      headers: {
        common: {
          authorization: 'Basic '+authHeader
        }
      }
    })

    const methods = ['post', 'get', 'put', 'delete']
    const self=this
    methods.forEach((method)=>{
      this[method] = (command, args, body)=>{
        return self.request(method.toLowerCase(), command, args, body)
      }
    })
  }

  connect(){
    this.get('connect').then(()=>{
      this.emit('connect', this)
    }).catch((err)=>{
      this.emit('error', err)
    })
    return this
  }

  disconnect(){
    const self = this;
    request.get(this.host + '/disconnect', function(err, response, body) {
      if (err) return self.trigger('error', err)
      self.trigger('disconnect')
    })
    return this
  }

  request(method, command, args, data) {
    const url = this.host + '/' + command + '/' + this.database + (args ? '/' + args : '')
    return this._axios({
      method: method,
      url: url,
      data: data
    })
  }

  language(language) {
    this._language = language;
    return this
  }

  command(command) {
    const language = this._language || 'sql';
    return this.post('command', language, command)
  }

  query(query, limit, fetchplan) {
    const language = this._language || 'sql';
    return this.get('query', language + '/' + encodeURIComponent(query) + (limit ? '/' + limit + (fetchplan ? '/' + fetchplan : '') : ''))
  }
}

/**
 * public connect method
 * creates new connection instance
 */

Connection.connect = (config, callback)=>{
  const db = new Connection(config)
  return db.connect()
}
module.exports=Connection
