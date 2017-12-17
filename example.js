const OrientDB=require ('./index')
const db=new OrientDB({
  user: 'root',
  password: 'root_passwdy',
  host: 'http://45.55.159.35:2480',
  database: 'wify',
})
db.connect().then(async (res)=>{
  console.log(res)
  res=await db.command('insert into V set name = ?', ["Batman"])
  console.log(res)
  res=await db.query('select * from V where name = :name', {
    name: "Batman"
  })
  console.log(res)
  res=await db.command('select * from V where name = ?', ["Batman"], 1)
  console.log(res)
  res=await db.delete('document', res.result[0]['@rid'])
  console.log(res)
})
db.on('connected',(res)=>{
  console.log('connected')
})
db.on('error',(message, err)=>{
  console.log(message)
  process.exit()
})
