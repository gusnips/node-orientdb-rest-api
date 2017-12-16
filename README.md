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

## Command and Query

```javascript
db.command('insert into V set name = ?', ["Batman"]).then(async ()=>{
  // named parameters
  const queryResult=await db.query('select * from V where name = :name', null, null, {
    name: "Batman"
  })
  console.log(queryResult)
}).catch((err)=>console.error(err))
```

## Methods

```javascript
// general api
db.[get|post|put|delete](command, queryParams, postBody).then(successHandler).catch(errorHandler)

db.post('document', null, { '@class': 'V', name: 'Gustavo Salome'}).then(successHandler).catch(errorHandler)

db.delete('document', '9:1').then(successHandler).catch(errorHandler)

// or specific commands
db.command('insert into V set name = "Batman"').then(successHandler).catch(errorHandler)

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
db.once('connected', (db)=>{
  console.log('yes! connected')
})
// on error
db.on('error',err=>{
  console.log('err', err.message)
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

db.connect().then(async ()=>{
  let res
  res=await db.command('insert into V set name = ?', ["Batman"])
  console.log(res)
  res=await db.query('select * from V where name = :name', {
    name: "Batman"
  })
  console.log(res)
  res=await db.command('select * from V where name = ?', ["Batman"], 1)
  console.log(res)
  res=await db.delete('document', res.result[0]['@rid'])
  console.log(res.status)
}).catch(err=>{
  if(!err)
    console.error('err')
  else if(err.response && err.response.data)
    console.error(err.response.data)
  else if(err.message)
    console.error(err.message)
  else
    console.error(err)
})
```

## Api

See [OrientDB-REST API](http://orientdb.com/docs/2.2.x/OrientDB-REST.html) for more docs.

## Erros

Listening for error events
```js
db.on('error',err=>{
  console.log('err', err)
})
```
See [Axios Error Handling](https://github.com/axios/axios#handling-errors) for more information

## Changelog

1.0.0

* First Release
