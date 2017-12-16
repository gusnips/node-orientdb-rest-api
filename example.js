const OrientDB=require ('./index')
const db=new OrientDB({
  user: 'root',
  password: 'root_passwd',
  host: 'http://45.55.159.35:2480',
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
  res=await db.put('select * from V where name = ?', ["Batman"], 1)
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
