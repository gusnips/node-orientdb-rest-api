orientdb-rest-api
==================

A Node.js driver to talk to the [OrientDB REST API](http://orientdb.com/docs/2.2.x/OrientDB-REST.html)

Very basic http wrapper using [axios](https://github.com/axios/axios) based on [node-orient-http](https://github.com/Havelaer/node-orientdb-http) and tested on [OrientDb](http://www.orientdb.org/) 2.2.31

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

## Command query and Query

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

All methods return a Promise, see [axios](https://github.com/axios/axios) for more information  
See [OrientDB-REST API](http://orientdb.com/docs/2.2.x/OrientDB-REST.html) for a list of commands  
```javascript
// general api
db.get(command, queryParams)
db.delete(command, queryParams)
db.head(command, queryParams)

db.post(command, queryParams, postBody)
db.put(command, queryParams, postBody)
db.patch(command, queryParams, postBody)

// create
db.post('document', null, { '@class': 'V', name: 'Gustavo Salome'})
  .then(successHandler)
  .catch(errorHandler)

// deleting, should return true
db.delete('document', '9:1')
  .then(successHandler)
  .catch(errorHandler)

// create as command, should return the new record
db.command('insert into V set name = "Batman"')
  .then(successHandler)
  .catch(errorHandler)

db.query('select * from V where name = "Batman"').then((res)=>{
  console.log(res)
}).catch(err=>{
  console.log(err.message)
})

db.language('gremlin').query("g.V('@class', 'User')").then(successHandler2).catch(errorHandler2)
```

## Events

```javascript
const db = new OrientDB({
  user: 'root',
  password: 'root_passwd',
  host: 'http://localhost:2480',
  database: 'GratefulDeadConcerts',
})

db.connect()
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
See [Axios Error Handling](https://github.com/axios/axios#handling-errors) for more information

## Changelog

1.0.0

* First Release
