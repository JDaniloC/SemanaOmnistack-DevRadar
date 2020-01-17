const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const http = require('http')

const routes = require('./routes')
const { setupWebsocket } = require('./websocket')

console.log("Servidor inicializado")
const app = express();
const server = http.Server(app)

setupWebsocket(server)

mongoose.connect('mongodb+srv://User:Senha@cluster0-6cyzb.mongodb.net/omnistack?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.set('useCreateIndex', true);

app.use(cors())
app.use(express.json())
app.use(routes)

console.log("Ouvindo em http://localhost:3333/")
server.listen(3333)