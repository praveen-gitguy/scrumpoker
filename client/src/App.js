import { useEffect } from 'react';

import { AddUserToGroup } from './pages/AddUserToGroup';
import socketIO from 'socket.io-client';
const socket = socketIO.connect('http://localhost:3001');


function App() {

  useEffect(() => {
    socket.on("messageR", (msg) => {
      console.log(msg)
    })
  }, [])

  return (
    <div className="App">
      <AddUserToGroup />
    </div>
  );
}

export default App;
