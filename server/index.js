const express = require("express");
const cors = require("cors");
const {Server} = require("socket.io")
const path = require("path");

const PORT = process.env.PORT || 3001;

const app = express();



if(process.env.NODE_ENV == 'production'){
    app.use(express.static("build"));
    app.get('*', (req, res)=>{
        res.sendFile(path.resolve(__dirname, "build", "index.html"))
    })
}

app.use(cors());

const server = app.listen(PORT, () => {
    console.log("App is running!!")
})

const io = new Server(server, {
    cors: {
        origin: "https://reactjs-node-socket-chat-app.herokuapp.com/",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket)=>{
    console.log(`User connected with ID ${socket.id}`);

    socket.on("join_room", (room)=> {
        socket.join(room);
        console.log(`User id ${socket.id} joined room ${room}`)
    })

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message",data)
    })

    socket.on("disconnect", () => {
        console.log("User disconnected " + socket.id)
    })
})





