import express from 'express';
import {createServer} from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server, Socket } from 'socket.io';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';


const app = express();
const server = createServer(app);

const io = new Server(server, {
    connectionStateRecovery: {}
});

app.use(express.static('dist'));

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res)=>{
    res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket: Socket) => {
    console.log('a user connected');
    io.emit('chat message', 'Connected')
    socket.on('chat message', async (msg) => {
       
        console.log('message: ' + msg);
            io.emit('chat message', msg);
      });


    socket.on('disconnect', ()=>{
        console.log('user disconnected')
        io.emit('chat message', 'User disconeccted')
    });
});

server.listen(3000, ()=>{
    console.log('Server running at http://localhost:3000');
})