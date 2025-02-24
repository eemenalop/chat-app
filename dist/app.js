import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
const db = await open({
    filename: 'chat.db',
    driver: sqlite3.Database
});
async function database() {
    await db.exec(`
        CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_offset TEXT UNIQUE,
        content TEXT)
        `);
}
database();
const app = express();
const server = createServer(app);
const io = new Server(server, {
    connectionStateRecovery: {}
});
app.use(express.static('dist'));
const __dirname = dirname(fileURLToPath(import.meta.url));
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('chat message', async (msg) => {
        let result;
        try {
            result = await db.run('INSERT INTO messages (content) VALUES (?)', msg);
        }
        catch (e) {
            return;
        }
        console.log('message: ' + msg);
        io.emit('chat message', msg, result.lastID);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
        io.emit('chat message', 'User disconeccted');
    });
});
const auth = socket.handshake?.auth || {};
if (!socket.recovered) {
    try {
        await db.each('SELECT id, content FROM messages WHERE id > ?', [socket.handshake?.auth?.serverOffset || 0], (_err, row) => {
            socket.emit('chat message', row.content, row.id);
        });
    }
    catch (e) {
        throw new Error('ERROR!');
    }
}
server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
