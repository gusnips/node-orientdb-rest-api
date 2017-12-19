orientdb-rest-api
==================

A Node.js driver to talk to the [OrientDB REST API](http://orientdb.com/docs/2.2.x/OrientDB-REST.html) for node and the browser
Also works with electron and react-native

Very basic http wrapper using [superagent](https://visionmedia.github.io/superagent/) based on [node-orient-http](https://github.com/Havelaer/node-orientdb-http) and tested on [OrientDb](http://www.orientdb.org/) 2.2.31

## Install

```bash
npm install orientdb-rest-api
```

## Basic Usage

```javascript
const OrientDB=require('orientdb-rest-api');

const db = new OrientDB({
  user: 'root',
  password: 'root_passwd',
  host: 'http://localhost:2480',
  database: 'GratefulDeadConcerts',
})

db.connect().then(async ()=>{
  const result=await db.query('select * from V where name = ?',["Batman"])
  console.log(result)
}).catch(err=>{
  console.error(err.message)
})
```

## Query and Command query

Syntax:
```js
db.query(query, parameters, limit, fetchplan)
db.command(query, parameters, limit, fetchplan)
```

Examples:

```javascript
db.command('insert into V set name = ?', ["Batman"]).then(async ()=>{
  // named parameters, no limit
  const res=await db.query('select * from V where name = :name', {
    name: "Batman"
  })
  db.command('select * from V where name = ?', ["Batman"], 1).then(successHandler)
}).catch((err)=>console.error(err))
```

Response will be something like:
```json
{
  "result": [
    {
      "@type": "d",
      "@rid": "#9:12",
      "@version": 1,
      "@class": "V",
      "name": "Batman"
    }
  ]
}
```

## Methods

All methods return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)  
See [superagent](https://visionmedia.github.io/superagent/) for more information about the response and errors

#### Connection

`db.connect()` returns `boolean`
`db.disconnect()` returns `boolean`

#### Rest commands:

`db.get(command, queryParams)` returns `object`  
`db.delete(command, queryParams)` returns `boolean`  
`db.head(command, queryParams)` returns `boolean`  

`db.post(command, queryParams, postBody)` returns `object`  
`db.put(command, queryParams, postBody)` returns `object`  
`db.patch(command, queryParams, postBody)` returns `object`  

#### Custom commands

`db.query(query, [paramenters, limit, fetchplan])` returns `object` containing the result of the query  
`db.command(query, [paramenters, limit, fetchplan])` returns `object`|`boolean` containing the result of the command  
`db.insert(className, data)` returns `boolean` shortcut as `db.post('document', null, data)` and set '@class' property of data  
`db.queryOne(query, paramenters, fetchplan)` returns `Object`|`null` shortcut for setting limit 1 and return either first result or null  

#### Helpers

`db.getDateTimeFormatted([fromDate])` return `string` returns a datetime formatted date. fromDate is optional, if not set, it will use current datetime  
`db.getDateFormatted([fromDate])` same as above  

#### Examples:
```js
// create
db.post('document', null, { '@class': 'V', name: 'Gustavo Salome'}).then().catch()

// deleting, should return true
db.delete('document', '9:1').then().catch()

// create as command, should return the new record
db.command('insert into V set name = "Batman"').then().catch()

db.query('select * from V where name = "Batman"').then((res)=>{
  console.log(res)
}, 1 /*1 is the limit*/).catch(err=>{
  console.log(err.message)
})
```

#### Language
```js
db.language('gremlin').query("g.V('@class', 'User')").then(successHandler2).catch(errorHandler2)
```

See [OrientDB-REST API](http://orientdb.com/docs/2.2.x/OrientDB-REST.html) for a full list of rest commands  

## Events

```javascript
const db = new OrientDB({
  user: 'root',
  password: 'root_passwd',
  host: 'http://localhost:2480',
  database: 'GratefulDeadConcerts',
})

db.connect()
db.disconnect()
// once connected
db.once('connected', (response)=>{
  console.log('yes! connected')
})
// on any error
db.on('error',(message, err)=>{
  console.log(message, err)
})
db.once('disconnected', (response)=>{
  console.log('bye!')
})
```

## Example

```js
const OrientDB=require ('orientdb-rest-api')
const db=new OrientDB({
  user: 'root',
  password: 'password',
  host: 'http://localhost:2480',
  database: 'GratefulDeadConcerts',
})
const config=require('./config/local')
const db=new OrientDB(config)
db.connect().then(async (res)=>{
  console.log(res) // true
  res=await db.command('insert into V set name = ?', ["Batman"])
  console.log(res) // Object containing the new record
  res=await db.query('select * from V where name = :name', {
    name: "Batman"
  })
  console.log(res) // Object containing the fetched record
  res=await db.command('select * from V where name = ?', ["Batman"], 1)
  console.log(res) // Same object containing the fetched record
  res=await db.delete('document', res.result[0]['@rid'])
  console.log(res) // true
  res=await db.disconnect()
})
db.on('connected',(res)=>{
  console.log('connected')
})
db.on('error',(message, err)=>{
  console.log(message)
  process.exit()
})
db.on('disconnected',(res)=>{
  console.log('disconnected')
})

```

## Api

See [OrientDB-REST API](http://orientdb.com/docs/2.2.x/OrientDB-REST.html) for more docs.

## Erros

Listening for error events
```js
db.on('error',(message, err)=>{
  console.log(message, err)
})
db.query('error query').catch((err)=>{
  console.log(err.message)
})
```
See [SuperAgent Error Handling](https://visionmedia.github.io/superagent/#error-handling) for more information

## Config

```javascript
{
  user: 'root',
  password: 'root_passwd',
  host: 'http://127.0.0.1:2480',
  database: 'GratefulDeadConcerts',
  language: 'sql',
  timeout: 1000*5,
}
```

## Changelog
1.1.0

* Changed from axios to superagent

1.0.0

* First Release
