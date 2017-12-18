const OrientDB=require ('./index')
const config=require('./config/sample')
const db=new OrientDB(config)
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
  res=await db.disconnect()
  console.log(res)
})
db.on('connected',(res)=>{
  console.log('connected',res)
})
db.on('error',(message, err)=>{
  console.log('new error',message, err)
  process.exit()
})
db.on('disconnected',(res)=>{
  console.log('disconnected')
})
