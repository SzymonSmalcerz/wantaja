let HomeState = {
  init(){
    this.game.stage.backgroundColor = "#000";
  },
  create(){
    this.textStyle = {
      font : "40pt bold",
      fill : "#fff"
    };

    this.background = this.game.add.sprite(0,0,"character");
    this.background.inputEnabled = true;
    this.background.events.onInputDown.add(this.startGame, this);

    let tapText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "tap to start", this.textStyle);
    tapText.anchor.setTo(0.5);

  },
  startGame(){
    console.log("clicked");
    this.game.state.start("GameState");
  }
}
