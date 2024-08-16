require('dotenv').config()
const express =require('express')
const connection = require('./config/db')
const userRouter =require('./route/user.route')
const bookRouter =require('./route/book.route')
const authentication = require('./middleware/auth.miidleware')
const cors =require('cors')
const app=express()
app.use(cors({
    origin: '*'
}));


app.use(express.json())


app.use('/user',userRouter)
app.use('/book',authentication,bookRouter)

app.get('/',(req,res)=>{
    console.log('this is home page')
    res.send('this is home page new')
})


app.listen(process.env.PORT,async()=>{
    try {
        await connection
        console.log(`server is live and connected to ${process.env.PORT}`)
    } catch (error) {
        console.log(`error connecting to server ${error}`)
    }
})
