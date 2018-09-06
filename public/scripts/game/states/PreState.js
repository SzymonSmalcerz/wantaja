let PreState = {
  init : function (){
    // console.log(this.game.plugins);
    // console.log(this.game);
    // console.log(Phaser.Plugin.KineticScrolling)
    this.game.kineticScrolling = this.game.plugins.add(Phaser.Plugin.KineticScrolling);
    this.game.kineticScrolling.configure({
      kineticMovement: true,
      timeConstantScroll: 325, //really mimic iOS
      horizontalScroll: false,
      verticalScroll: true,
      horizontalWheel: false,
      verticalWheel: true,
      deltaWheel: 40
  });
    // this.game.stage.backgroundColor = "#fff";
    // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.refresh();
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.time.desiredFps = 20;
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
