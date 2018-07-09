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

    /* Info and dialog sprites */
    this.load.spritesheet("okButton", "assets/infoTables/okButton.png",200,92);
    this.load.image("wonInfo", "assets/infoTables/wonInfo.png");
    this.load.image("skill_punch_description","assets/infoTables/skillDescriptions/skill_punch_description.png");
    this.load.image("skill_health_description","assets/infoTables/skillDescriptions/skill_punch_description.png");
    this.load.image("skill_poison_description","assets/infoTables/skillDescriptions/skill_punch_description.png");
    this.load.image("skill_mana_description","assets/infoTables/skillDescriptions/skill_punch_description.png");
    this.load.image("skill_sword_description","assets/infoTables/skillDescriptions/skill_punch_description.png");
    this.load.image("questionMark","assets/infoTables/questionMark.png");
    this.load.spritesheet("plusButton","assets/UI/plusButton.png",50,50);

    /* status points */
    this.load.image("statusPoints", "assets/UI/statusPoints.png");
    this.load.image("statusPoints_strength_description", "assets/UI/statusPoints_strength_description.png");
    this.load.image("statusPoints_agility_description", "assets/UI/statusPoints_agility_description.png");
    this.load.image("statusPoints_intelligence_description", "assets/UI/statusPoints_intelligence_description.png");
    this.load.image("statusPoints_vitality_description", "assets/UI/statusPoints_vitality_description.png");

    /* Fight sprites */
    this.load.image("fightingBackgroungFirstMap", "assets/fight/fightingBackgroungFirstMap.png");
    this.load.image("bloodParticle","assets/fight/bloodParticle.png");
    this.load.spritesheet("fightInitButton","assets/fight/fightInitButton.png",48,48);
    this.load.spritesheet("fightAbortButton","assets/fight/fightAbortButton.png",48,48);
    this.load.spritesheet("skill_health","assets/fight/skills/skill_health.png",48,48);
    this.load.spritesheet("skill_mana","assets/fight/skills/skill_mana.png",48,48);
    this.load.spritesheet("skill_poison","assets/fight/skills/skill_poison.png",48,48);
    this.load.spritesheet("skill_punch","assets/fight/skills/skill_punch.png",48,48);
    this.load.spritesheet("skill_sword","assets/fight/skills/skill_sword.png",48,48);
    this.load.spritesheet("skill_punch_animation","assets/fight/skills/skill_punch_animation.png",128,128);
    this.load.spritesheet("skill_health_animation","assets/fight/skills/skill_punch_animation.png",128,128);
    this.load.spritesheet("skill_mana_animation","assets/fight/skills/skill_punch_animation.png",128,128);
    this.load.spritesheet("skill_poison_animation","assets/fight/skills/skill_poison_animation.png",128,128);
    this.load.spritesheet("skill_sword_animation","assets/fight/skills/skill_punch_animation.png",128,128);

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
    this.load.spritesheet("spider", "assets/enemies/spider.png",64 ,64);
    this.load.image("spiderlogo", "assets/enemies/spiderlogo.png");

    //player
    this.load.spritesheet("player", "assets/player/player.png",64 ,64);


    /* UI */
    // bars [health bar/ experience bar etc]
    this.load.image("healthBar", "assets/UI/bars/healthBar.png");
    this.load.image("healthBarDark", "assets/UI/bars/healthBarDark.png");
    this.load.image("experienceBar", "assets/UI/bars/experienceBar.png");
    this.load.image("experienceBarDark", "assets/UI/bars/experienceBarDark.png");
    this.load.image("manaBar", "assets/UI/bars/manaBar.png");
    this.load.image("manaBarDark", "assets/UI/bars/manaBarDark.png");

    // player logo
    this.load.image("playerlogo", "assets/player/playerlogo.png");

    // other ui stuff
    this.load.image("uiTile", "assets/UI/uiTile.png");
  },
  create(){
    this.game.state.start("HomeState");
  }
}
