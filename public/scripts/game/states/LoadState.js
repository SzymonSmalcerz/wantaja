let LoadState = {

  preload : function(){
    this.progressBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 100, "progressBar");
    this.progressBar.anchor.setTo(0.5);
    this.load.setPreloadSprite(this.progressBar);

    this.load.spritesheet("character", "assets/character.png",64 ,64);
    this.load.tilemap("firstMap","assets/maps/firstMap.json",null,Phaser.Tilemap.TILED_JSON);
    this.load.image("tileset16", "assets/tileset16.png");
  },
  create(){
    this.game.state.start("HomeState");
  }
}