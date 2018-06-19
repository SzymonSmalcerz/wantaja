let LoadState = {

  preload : function(){
    this.progressBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 100, "progressBar");
    this.progressBar.anchor.setTo(0.5);
    this.load.setPreloadSprite(this.progressBar);

    this.load.spritesheet("character", "assets/character.png",64 ,64);
    this.load.spritesheet("spider", "assets/spider.png",32 ,32);
    this.load.tilemap("firstMap","assets/maps/firstMap.json",null,Phaser.Tilemap.TILED_JSON);
    this.load.image("tileset16", "assets/tileset16.png");
    this.load.image("house1", "assets/house1.png");
    this.load.image("fightSprite", "assets/fightSprite.png");
  },
  create(){
    this.game.state.start("HomeState");
  }
}
