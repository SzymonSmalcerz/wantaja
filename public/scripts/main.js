initializeConnection();


function initializeConnection(){
  var socket = socket || io();
  window.onload = function(){

    socket.on('connect', function () {
      console.log('Connected to server, waiting for data ..');
      socket.emit("getGameData",{
        id : playerID
      });
    });

    socket.on('initialData',function(data){
      handler.startGame(data,socket);
    });

    socket.on('alreadyLoggedIn', function(data){
      console.log(data);
      handler.startGame(data,socket);
    });
  };
};
