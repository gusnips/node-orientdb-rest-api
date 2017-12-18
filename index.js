// we don`t want to use node core modules to be able to use in electron/react/browser
const request=require('superagent')
const EventEmitter=require("event-emitter")
const base64=require("base-64")

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
   language: 'sql',
   timeout: 1000*5,
}
class Connection {
  constructor(config) {
    this.user=config.user || defaultConfig.user
    this.password=config.password || defaultConfig.password
    this.host=config.host || defaultConfig.host
    this.database=config.database || defaultConfig.database
    this._language=config.language || defaultConfig.language
    this._timeout=config.timeout || defaultConfig.timeout
    this._authHeader='Basic '+base64.encode(this.user+':'+this.password)

    const methods = ['post', 'get', 'put', 'delete', 'head', 'patch']
    methods.forEach((method)=>{
      this[method] = (command, args, body)=>{
        return this.request(method.toLowerCase(), command, args, body)
      }
    })
  }

  connect(){
    return this.get('connect').then((response)=>{
      this.emit('connected', response)
      return response
    }).catch((err)=>{
      this._onError(err)
      return err
    })
  }

  disconnect(){
    return request.get(this.host+'/disconnect')
      .set('Authorization',this._authHeader)
      .send()
      .then(response=>{})
      .catch(err=>{
        if(
            err.response.status===401 && err.response.body && err.response.body.errors &&
            Array.isArray(err.response.body.errors) && err.response.body.errors.length
        ){
          let response=err.response.body.errors[0]
          this.emit('disconnected', response)
          return true
        } else
          this._onError(err)
      })
  }

  request(method, command, args, data) {
    args=args ? args.replace('#','') : ''
    const url = this.host+'/'+command+'/'+this.database+'/'+args
    const requestInstance=request[method](url)
      .timeout(this._timeout)
      .set('Authorization', this._authHeader)
      .set('Accept', 'application/json')
      .set('Accept-Encoding','gzip, deflate')
    if(['get','delete'].indexOf(method.toLowerCase())===-1)
      requestInstance.set('Content-Length', data ? JSON.stringify(data).length : null)
    return requestInstance.send(data)
      .then((response)=>{
        if(response.statusCode===204)
          return true
        return response.body
      }).catch(err=>{
        this._onError(err)
        throw err
      })
  }

  command(command, parameters, limit, fetchplan) {
    const postData={
      command: command,
      parameters: parameters || []
    }
    const args=this._makeArgsUrl('', limit, fetchplan)
    return this.post('command', args, postData)
  }

  query(query, parameters, limit, fetchplan) {
    const language = this._language
    if(!parameters){
      const args=this._makeArgsUrl(query, limit, fetchplan)
      return this.get('query', args)
    }
    return this.command(query, parameters, limit, fetchplan)
  }

  _makeArgsUrl(command, limit, fetchplan){
    limit=limit ? `/${limit}` : ''
    fetchplan=fetchplan ? `/${fetchplan}` : ''
    command=command ? encodeURIComponent(command) : ''
    return `${this._language}/${command}${limit}${fetchplan}`
  }

  _onError(err){
    if(!err)
      this.emit('error')
    else if(err.response && err.response.body)
      this.emit('error', err.response.statusCode+': '+err.message, err.response.body)
    else if(err.response && err.response.text)
      this.emit('error', err.response.statusCode+': '+err.message, err.response.text)
    else
      this.emit('error',err)
  }

  language(language) {
    this._language = language;
    return this
  }
}

EventEmitter(Connection.prototype)
/**
 * public connect method
 * creates new connection instance
 */

 // Expose the class either via AMD, CommonJS or the global object
 if (typeof define === 'function' && define.amd) {
     define(()=>{ return Connection })
 } else if (typeof module === 'object' && module.exports){
     module.exports = Connection
     module.exports.default = Connection
 } else {
     exports.Connection = Connection
     exports.default = Connection
 }
