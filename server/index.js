const express = require('express');
const cors = require('cors');
const { createServer } = require('node:http');
const { Server } = require('socket.io')
const path = require("path");

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
})

const groups = [{ name: 'Portals', slug: "portals" }, { name: "Portals LC", slug: "portals-lc" }];
let allUsers = [];

io.on('connection', (socket) => {
    let username, groupName;
    socket.on('join_group', (data) => {
        const { group, user } = data
        username = user;
        groupName = group;
        socket.join(group);
        const idx = allUsers.findIndex((userData) => userData.group === group && userData.username === user)
        if (idx < 0) {
            allUsers.push({ id: socket.id, username: user, group, vote: 0 });
        }
        const chatRoomUsers = allUsers.filter((user) => user.group === group);
        socket.to(group).emit('chatroom_users', chatRoomUsers);
        socket.emit('chatroom_users', chatRoomUsers)
    })


    socket.on('vote', (data) => {
        const { group, user, voteValue } = data;
        const idx = allUsers.findIndex((userData) => userData.group === group && userData.username === user)
        if (idx > -1) {
            allUsers[idx].vote = voteValue
        }
        socket.to(group).emit('vote-res', allUsers);
        socket.emit('vote-res', allUsers)
    });

    socket.on('reset-vote', (data) => {
        const { group } = data
        allUsers = allUsers.map((userData) => {
            if (userData.group === group) userData.vote = 0
            return userData;
        });
        socket.to(group).emit('reset-vote', allUsers);
        socket.emit('reset-vote', allUsers)
    })
    socket.on('show-result', (data) => {
        const { group, avg } = data;
        socket.to(group).emit('show-result', avg);
        socket.emit('show-result', avg)
    })

    socket.on('disconnect', () => {
        allUsers = allUsers.filter(user => user.group === groupName && user.username !== username)
        socket.to(groupName).emit('chatroom_users', allUsers);
        socket.emit('chatroom_users', allUsers)
        socket.leave(groupName);
    })
})

app.use(cors())
app.use(express.json());
app.use(
    express.static(path.join(__dirname, "../client/build"))
);

app.get("/groups", (req, res) => {
    res.status(200).json({ status: "success", groups })
})

app.get("*", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../client/build/index.html")
    );
});

server.listen(process.env.PORT || 3001, () => {
    console.log(`server running on ${process.env.PORT}`);
});