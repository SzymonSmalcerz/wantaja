let LoadState = {

  preload : function(){
    this.logo = this.add.sprite(this.game.world.centerX, this.game.world.centerY,"mainShip",0);
    this.logo.anchor.setTo(0.5);

    this.progressBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 100, "progressBar");
    this.progressBar.anchor.setTo(0.5);
    this.load.setPreloadSprite(this.progressBar);

    this.load.spritesheet("character", "assets/character.png",64 ,64);
  },
  create(){
    this.game.state.start("HomeState");
  }
}
