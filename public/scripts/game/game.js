let handler = {
  otherPlayers : {},
  enemies : {},
  entities : {},
  playerID : undefined, // set in startGame function
  socket : undefined
};

handler.startGame = function(data,socket){
  this.socket = socket;
  this.playerID = data.characterData.id;
  this.game = new Phaser.Game(360,640, Phaser.CANVAS);
  this.game.state.add("PreState", PreState);
  this.game.state.add("LoadState", LoadState);
  this.game.state.add("HomeState", HomeState);
  this.game.state.add("GameState", GameState);
  this.game.state.start("PreState");
  window.addEventListener("resize", () => {
    this.game.scale.refresh();
  });

  this.setSockets();
};

handler.setSockets = function(){
  socket.on('checkForConnection', function () {
    socket.emit("checkedConnection",{
      id : handler.playerID
    });
  });
};
