let LoadState = {

  preload : function(){
    this.progressBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 100, "progressBar");
    this.progressBar.anchor.setTo(0.5);
    this.load.setPreloadSprite(this.progressBar);


    this.load.tilemap("firstMap","assets/maps/firstMap.json",null,Phaser.Tilemap.TILED_JSON);
    this.load.image("tileset16", "assets/maps/tilesetfirstMap.png");
    this.load.image("house1", "assets/house1.png");

    /* Shortest Path */
    this.load.image("xGreen", "assets/shortestPath/xGreen.png");
    this.load.image("xRed", "assets/shortestPath/xRed.png");

    /* Fight sprites */
    this.load.image("fightBackground", "assets/fight/fightSprite.png");
    this.load.image("fightingBackgroungFirstMap", "assets/fight/fightingBackgroungFirstMap.png");
    this.load.image("fightingButtonPunch","assets/fight/fightingButtonPunch.png");
    this.load.image("bloodParticle","assets/fight/bloodParticle.png");
    this.load.image("fightInitButton","assets/fight/fightInitButton.png");
    this.load.image("fightInitButton","assets/fight/fightInitButton.png");
    this.load.image("fightAbortButton","assets/fight/fightAbortButton.png");
    this.load.image("skill_health","assets/fight/skills/skill_health.png");
    this.load.image("skill_mana","assets/fight/skills/skill_mana.png");
    this.load.image("skill_poison","assets/fight/skills/skill_poison.png");
    this.load.image("skill_punch","assets/fight/skills/skill_punch.png");
    this.load.image("skill_sword","assets/fight/skills/skill_sword.png");

    /* Entities */
    // trees
    this.load.image("tree1", "assets/trees/tree1.png");
    this.load.image("tree2", "assets/trees/tree2.png");
    this.load.image("tree3", "assets/trees/tree3.png");
    this.load.image("tree4", "assets/trees/tree4.png");
    // others
    this.load.image("barell", "assets/entities/barell.png");
    this.load.image("wood", "assets/entities/wood.png");
    this.load.image("wheat", "assets/entities/wheat.png");
    this.load.image("well", "assets/entities/well.png");
    this.load.image("house2", "assets/entities/house2.png");
    // enemies
    this.load.spritesheet("spider", "assets/enemies/spider.png",32 ,32);
    this.load.image("spiderlogo", "assets/enemies/spiderlogo.png");

    //player
    this.load.spritesheet("player", "assets/player/player.png",64 ,64);


    /* UI */
    // bars [health bar/ experience bar etc]
    this.load.image("healthBar", "assets/UI/bars/healthBar.png");
    this.load.image("healthBarDark", "assets/UI/bars/healthBarDark.png");
    this.load.image("experienceBar", "assets/UI/bars/experienceBar.png");
    this.load.image("experienceBarDark", "assets/UI/bars/experienceBarDark.png");

    // player logo
    this.load.image("playerlogo", "assets/player/playerlogo.png");
  },
  create(){
    this.game.state.start("HomeState");
  }
}
