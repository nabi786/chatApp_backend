const express = require("express")
const app = express()
const cors = require('cors')
const http = require('http')
const socketIO = require("socket.io")
const PORT = 3000 | process.env.PORT


// global midlewears
app.use(cors())
// creating server
const server = http.createServer(app)
// socket io 
const io = socketIO(server)


const users =[]
io.on("connection", (socket)=>{
    console.log("New Connection")


    socket.on("joined", ({user})=>{
        users[socket.id] = user
        console.log("user joned ", user)
        // sending server to client
        socket.emit("welcome", {user : "Admin",message : `${users[socket.id]} Welcome to the chat`})
        socket.broadcast.emit("userJoined", {user : "Admin", message:`${users[socket.id]} has joined`})

    }) 


    // receieve messages
    socket.on("message", ({id,message})=>{
        console.log("id is ", id)
        // console.log("msg is ", message)
        io.emit("sendMsg", {user:users[id],message,id})
    })


    // when user disconnect
    socket.on("disconnect", ()=>{
        socket.broadcast.emit("userLeft", {user : "Admin",message : `${users[socket.id]} left`})
    })
    
})

// Routes
app.get("/", (req,res)=>{
    res.status(200).json({msg : "RealTime Chat Application is working"})
})

// listening to port
server.listen(PORT, ()=>{
    console.log(`server is running on this PORT ${PORT}`)
})