let PreState = {
  init : function (){
    this.game.stage.backgroundColor = "#fff";
    // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.refresh();
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.time.desiredFps = 10;
    this.game.time.advancedTiming = true;
  },
  preload(){
    this.load.image("progressBarFull","assets/loadScreen/progressBarFull.png");
    this.load.image("progressBarEmpty","assets/loadScreen/progressBarEmpty.png");
    this.load.image("loadScreenBackground","assets/loadScreen/loadScreenBackground.png");
  },
  create(){
    this.game.state.start("LoadState");
  }
}
