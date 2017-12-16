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
  const result=await db.query('select * from V where name = "Batman"')
  console.log(result.data)
}).catch(err=>{
  console.error(err.message)
})
db.connet
```

## Shorthand constructor

```javascript
const db = new OrientDB.connect({
  user: 'root',
  password: 'root_passwd',
  host: 'http://localhost:2480',
  database: 'GratefulDeadConcerts',
})

db.once('connect', ()=>{
  console.log('yes! connected')
})
//connection error
db.on('error',err=>{
  console.log('err', err.message)
  process.exit()
})
```

## Play

```javascript
// general api
db.[get|post|put|delete](command, queryParams, postBody).then(successHandler).catch(errorHandler)

db.post('document', null, { '@class': 'V', name: 'Gustavo Salome'}).then(successHandler).catch(errorHandler)

db.delete('document', '9:1').then(successHandler).catch(errorHandler)

// or specific commands
db.command('insert into V set name = "Batman"').then(successHandler).catch(errorHandler)

db.query('select * from V where name = "Batman"').then((res)=>{
  console.log(res.data)
}).catch(err=>{
  console.log(err.message)
})

db.language('gremlin').query("g.V('@class', 'User')").then(successHandler2).catch(errorHandler2)
```
## Api

See [OrientDB-REST API](http://orientdb.com/docs/2.2.x/OrientDB-REST.html) for more docs.

## Erros

See [Axios Error Handling](https://github.com/axios/axios#handling-errors) for more information

## Changelog

1.0.0

* First Release
