initializeConnection();


function initializeConnection() {
  var socket = socket || io();
  window.onload = function(){

    socket.on('connect', function () {
      socket.emit("getGameData",{
        id : playerID
      });
    });

    socket.on('initialData',function(data) {
      handler.startGame(data,socket);
    });

    socket.on('alreadyLoggedIn', function(data) {
      // handler.startGame(data,socket);
      alert(data.message + "\nwait 10 seconds\nand try again");
    });
  };
};
