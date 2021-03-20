const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/tasks')
const path = require('path')

const app = express()
const port = process.env.PORT 

console.log(__dirname)
const pubdir = path.join(__dirname, '../public')
app.use(express.static(pubdir))

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port,()=>{
    console.log('Server up at port ',port)
})



