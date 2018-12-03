let PreState = {
  init : function () {
    handler.currentState = this;
    this.game.kineticScrolling = this.game.plugins.add(Phaser.Plugin.KineticScrolling);
    this.game.kineticScrolling.configure({
      kineticMovement: true,
      timeConstantScroll: 325,
      horizontalScroll: false,
      verticalScroll: true,
      horizontalWheel: false,
      verticalWheel: true,
      deltaWheel: 40
  });
    this.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.refresh();
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.time.desiredFps = 20;
    this.game.time.advancedTiming = true;
  },
  preload() {
    this.load.image("progressBarFull","assets/loadScreen/progressBarFull.png");
    this.load.image("progressBarEmpty","assets/loadScreen/progressBarEmpty.png");
    this.load.image("loadScreenBackground","assets/loadScreen/loadScreenBackground.png");
  },
  create() {
    this.game.state.start("LoadState");
  },
  onResize() {
    console.log("preState TODO onResize");
  },
  styleText(text) {
    handler.styleText(text);
  },
  fixText(text) {
    handler.fixText(text);
  }
}
