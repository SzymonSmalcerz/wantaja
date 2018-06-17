initializeConnection();




function initializeConnection(){
  var socket = socket || io();
  window.onload = function(){

    socket.on('connect', function () {
      console.log('Connected to server');
      socket.emit("getGameData",{
        id : playerID
      });
    });

    socket.on('initialData',function(data){
      startGame(data);
    });

    socket.on('alreadyLoggedIn', function(data){
      console.log(data);
    });
  };
};



function startGame(data){
  console.log("starting game");
  console.log("player id : " + playerID);
  console.log("received data : ");
  console.log(data);
};
