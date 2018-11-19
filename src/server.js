const app = require("express")();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const fs = require('fs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
server.listen(8888, "localhost", () => console.log("服务已经启动"));
app.post('/login', (req, res) => {
    const info = req.body;
    const index = members.findIndex(item => item.username === info.username && item.password === info.password);
    if (~index) {
        res.send({ state: 1, data: Object.assign(members[index], { list: [...clients.keys()] }) });
    } else {
        res.send({ state: 0 });
    }
});
app.post('/register', (req, res) => {
    const info = req.body;
    const index = members.findIndex(item => item.username === info.username);
    if (~index) {
        res.send({ state: 0 });
    } else {
        members.push(Object.assign(info, { data: [] }));
        res.send({ state: 1 });
        saveToDatabase()
    }
});
io.on('connection', function (socket) {
    let user = '';
    socket.on('login', username => {
        user = username;
        socket.join('group', () => io.emit('message', ['system', { type: 'join', username: user, message: 'join the group' }]));
        clients.set(user, socket);
    });
    socket.on('disconnect', function () {
        socket.leave('group', () => io.emit('message', ['system', { type: 'leave', username: user, message: 'leave the group' }]));
        clients.delete(user);
    });
    socket.on('message', data => {
        if (data.target === 'group') {
            io.to('group').emit('message', ['group', data]);
            saveGroupMessage(data, members);
            saveToDatabase();
        } else {
            if (clients.get(data.target)) {
                clients.get(data.target).emit('message', [data.from, data]);
            }
            socket.emit('message', [data.target, data]);
            saveSingleMessage(data);
            saveToDatabase();
        }
    });
});
fs.readFile(__dirname + '/../chatInfo.json', function (err, data) {
    if (err) console.log(err);
    members = JSON.parse(data);
});
function saveToDatabase() {
    fs.writeFile(__dirname + '/../chatInfo.json',JSON.stringify(members,null,4),function(err){
        if (err) console.log(err);
    });
}
const clients = new Map();
let members = [];
function saveGroupMessage(msg, group) {
    group.forEach(item => {
        item.data.push(['group', msg]);
    });
}
function saveSingleMessage(data) {
    const a = members.find(item => item.username === data.from);
    const b = members.find(item => item.username === data.target);
    a.data.push([data.target, data]);
    b.data.push([data.from, data]);
}
