let PreState = {
  init : function (){
    this.game.stage.backgroundColor = "#fff";
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.refresh();
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.time.desiredFps = 10;
  },
  preload(){
    this.load.image("progressBar","assets/progresBar.png");
  },
  create(){
    this.game.state.start("LoadState");
  }
}
