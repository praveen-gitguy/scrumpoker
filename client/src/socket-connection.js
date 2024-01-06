import socketIO from 'socket.io-client';
const socket = socketIO.connect('http://localhost:3001');

export default socket;