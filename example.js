const OrientDB=require ('./index')
const db=OrientDB.connect({
  user: 'root',
  password: 'root_passwd',
  host: 'http://127.0.0.1:2480',
  database: 'GratefulDeadConcerts',
})
db.on('connect', ()=>{
  db.query('select * from V where name = "Batman"').then((res)=>{
    console.log(res.data)
  })
})
db.on('error',error=>{
  console.log('Error', error.message)
  process.exit()
})
