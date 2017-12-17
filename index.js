const axios = require('axios')
// we don`t want to use node modules
const EventEmitter=require("event-emitter")
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
   timeout: 60*1000*5,
   maxContentLength: 50 * 1000 * 1000,
}
class Connection {
  constructor(config) {
    this.user=config.user || defaultConfig.user
    this.password=config.password || defaultConfig.password
    this.host=config.host || defaultConfig.host
    this.database=config.database || defaultConfig.database
    this._language=config.language || defaultConfig.language
    const authHeader=Buffer.from(this.user+':'+this.password).toString('base64')
    this._axios = axios.create({
      timeout: defaultConfig.timeout, // 5 minutes sec timeout
      maxContentLength: defaultConfig.maxContentLength, // 50MBs, just in case
      headers: {
        common: {
          authorization: 'Basic '+authHeader
        }
      }
    })

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
    this._axios.get(this.host+'/disconnect').then((response, body)=>{
      this.emit('disconnect', response, body)
    }).catch(err=>{
       this._onError(err)
       return err
    })
    return this
  }

  request(method, command, args, data) {
    //fix for # in url
    args=args ? args.replace('#','') : ''
    const url = this.host+'/'+command+'/'+this.database+'/'+args
    return this._axios({
      method: method,
      url: url,
      data: data
    }).then((response)=>{
      if(response.data)
        return response.data
      else if(response.status===204)
        return true
      return response
    }).catch(err=>{
      this._onError(err)
      return err
    })
  }

  command(command, parameters, limit, fetchplan) {
    let args=this._language
    if(limit || fetchplan)
      args=this._makeArgsUrl('', limit, fetchplan)
    return this.post('command', args, {
      command: command,
      parameters: parameters || []
    }, limit, fetchplan)
  }

  query(query, parameters, limit, fetchplan) {
    const language = this._language;
    if(!parameters){
      const args=this._makeArgsUrl(query, limit, fetchplan)
      return this.get('query', args)
    }
    return this.command(query, parameters, limit, fetchplan)
  }
  _makeArgsUrl(command, limit, fetchplan){
    limit=limit || ''
    fetchplan=fetchplan || ''
    command=encodeURIComponent(command)
    return `${this._language}/${command}/${limit}/${fetchplan}`
  }

  _onError(err){
    if(err){
      if(err.message)
        this.emit('error', err.message, err)
      else if(err.response && err.response.data)
        this.emit('error', err.response.data, err)
      else
        this.emit('error',err)
    } else
      this.emit('error')
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

module.exports=Connection
