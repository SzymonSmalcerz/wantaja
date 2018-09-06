let LoadState = {

  preload : function(){
    this.loadScreenBackground = this.add.sprite(this.game.world.centerX, this.game.world.centerY,"loadScreenBackground");
    this.loadScreenBackground.anchor.setTo(0.5);
    this.loadScreenBackground.smoothed = false;
    this.progressBarEmpty = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 100, "progressBarEmpty");
    this.progressBarEmpty.anchor.setTo(0.5);
    this.progressBarFull = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 100, "progressBarFull");
    this.progressBarFull.anchor.setTo(0.5);
    this.load.setPreloadSprite(this.progressBarFull);
    this.loadText = this.add.text(this.game.world.centerX, this.game.world.centerY - 100);
    let textCss = {
      font : "20px bold",
      fontWeight : "900",
      stroke : '#FFF',
      strokeThickness : 2,
      fill : '#000'
    }
    this.loadText.setStyle(textCss);
    this.loadText.smoothed = false;
    this.loadText.anchor.setTo(0.5);
    this.loadText.text = 'Game is loading';
    this.loadText.fontSize = 25;

    /* assets for home state */
    this.load.spritesheet("button","assets/homeState/button.png",200,100);
    this.load.image("scrollbar_top","assets/homeState/scrollbar_top.png");
    this.load.image("background_homeState","assets/homeState/background_homeState.png");
    this.load.image("scrollbar_bottom","assets/homeState/scrollbar_bottom.png");
    this.load.image("scrollbar_middle","assets/homeState/scrollbar_middle.png");
    this.load.image("scrollbar_wheel","assets/homeState/scrollbar_wheel.png");
    this.load.spritesheet("checkbox_avatars","assets/homeState/checkbox_avatars.png",40,40);
    /* end of assets for home state */

    // player avatars //
    //player
    this.load.spritesheet("player", "assets/player/player.png",64 ,64);


    for (var key in handler.playerAvatarDictionary) {
      if (handler.playerAvatarDictionary.hasOwnProperty(key)) {
        handler.playerAvatarDictionary[key].levels.forEach(level => {
          if(level != 1) {
            handler.playerAvatarDictionary[key].names.forEach(name => {
              this.load.spritesheet(key + '_' + level + '_' + name, "assets/player/" + key + "/" + level + 'lvl_' + name + ".png",64,64);
            });
          };
        });
        this.load.spritesheet(key + '_1', "assets/player/" + key + "/1lvl.png",64,64);
      }
    }


    this.load.tilemap("firstMap","assets/maps/firstMap.json",null,Phaser.Tilemap.TILED_JSON);
    this.load.tilemap("secondMap","assets/maps/secondMap.json",null,Phaser.Tilemap.TILED_JSON);
    this.load.image("tileset16", "assets/maps/tilesetfirstMap.png");
    this.load.spritesheet("door_to_map", "assets/maps/door_to_map.png",30,46);
    this.load.image("grass", "assets/maps/grass.png");
    this.load.image("house1", "assets/house1.png");
    this.load.image("collisionSquare", "assets/collisionSquare.png");

    /* Fences */
    this.load.image("fence_horizontal", "assets/fences/fence_horizontal.png");
    this.load.image("fence_vertical", "assets/fences/fence_vertical.png");

    /* Shortest Path */
    this.load.image("xGreen", "assets/shortestPath/xGreen.png");
    this.load.image("xRed", "assets/shortestPath/xRed.png");

    /* Info and dialog sprites */
    this.load.spritesheet("okButton", "assets/infoTables/okButton.png",200,92);
    this.load.image("wonInfo", "assets/infoTables/wonInfo.png");
    this.load.image("mobDescriptionFrame", "assets/infoTables/mobDescriptionFrame.png");
    this.load.image("normalAlert", "assets/infoTables/alerts/normalAlert.png");
    this.load.image("townAlert", "assets/infoTables/alerts/townAlert.png");
    this.load.image("damageEnemyAlert", "assets/infoTables/alerts/damageEnemyAlert.png");
    this.load.image("damagePlayerAlert", "assets/infoTables/alerts/damagePlayerAlert.png");
    this.load.image("dodgeAlert", "assets/infoTables/alerts/dodgeAlert.png");
    this.load.image("healthAlert", "assets/infoTables/alerts/healthAlert.png");
    this.load.image("someoneElseFightingAlert", "assets/infoTables/alerts/someoneElseFightingAlert.png");

    this.load.image("skill_punch_description","assets/fight/skills/skillDescriptions/skill_punch_description.png");
    this.load.image("skill_health_description","assets/fight/skills/skillDescriptions/skill_health_description.png");
    this.load.image("skill_poison_description","assets/fight/skills/skillDescriptions/skill_poison_description.png");
    this.load.image("skill_ignite_description","assets/fight/skills/skillDescriptions/skill_ignite_description.png");
    this.load.image("skill_entangle_description","assets/fight/skills/skillDescriptions/skill_entangle_description.png");

    this.load.image("skill_punch_blocked_description","assets/fight/skills/skillDescriptions/skill_punch_blocked_description.png");
    this.load.image("skill_health_blocked_description","assets/fight/skills/skillDescriptions/skill_health_blocked_description.png");
    this.load.image("skill_poison_blocked_description","assets/fight/skills/skillDescriptions/skill_poison_blocked_description.png");
    this.load.image("skill_ignite_blocked_description","assets/fight/skills/skillDescriptions/skill_ignite_blocked_description.png");
    this.load.image("skill_entangle_blocked_description","assets/fight/skills/skillDescriptions/skill_entangle_blocked_description.png");

    this.load.image("questionMark","assets/infoTables/questionMark.png");
    this.load.spritesheet("plusButton","assets/UI/plusButton.png",50,50);
    this.load.spritesheet("closeButton","assets/UI/closeButton.png",50,50);

    /* frames */
    this.load.image("frame", "assets/UI/frame.png");
    this.load.image("equipmentFrame", "assets/UI/equipmentFrame.png");

    /* status points */
    this.load.image("statusPoints", "assets/UI/statusPoints.png");
    this.load.image("statusPoints_strength_description", "assets/UI/statusPoints_strength_description.png");
    this.load.image("statusPoints_agility_description", "assets/UI/statusPoints_agility_description.png");
    this.load.image("statusPoints_intelligence_description", "assets/UI/statusPoints_intelligence_description.png");
    this.load.image("statusPoints_vitality_description", "assets/UI/statusPoints_vitality_description.png");

    /* character data */
    this.load.image("characterDataFrame", "assets/UI/characterData/characterDataFrame.png");
    this.load.image("characterData_level_description", "assets/UI/characterData/characterData_lvl_description.png");
    this.load.image("characterData_health_description", "assets/UI/characterData/characterData_health_description.png");
    this.load.image("characterData_mana_description", "assets/UI/characterData/characterData_mana_description.png");
    this.load.image("characterData_attack_description", "assets/UI/characterData/characterData_attack_description.png");
    this.load.image("characterData_dodge_description", "assets/UI/characterData/characterData_dodge_description.png");

    /* settings */
    this.load.spritesheet("settingsButton", "assets/UI/settings/settingsButton.png",50,50);

    /* Fight sprites */
    this.load.image("fightingBackgroungFirstMap", "assets/fight/fightingBackgroungFirstMap.png");
    this.load.image("bloodParticle","assets/fight/bloodParticle.png");
    this.load.spritesheet("fightSwords","assets/fight/fightSwords.png",32,32);
    this.load.spritesheet("fightInitButton","assets/fight/fightInitButton.png",48,48);
    this.load.spritesheet("fightAbortButton","assets/fight/fightAbortButton.png",48,48);
    this.load.spritesheet("skill_health","assets/fight/skills/skill_health.png",48,48);
    this.load.spritesheet("skill_ignite","assets/fight/skills/skill_ignite.png",48,48);
    this.load.spritesheet("skill_poison","assets/fight/skills/skill_poison.png",48,48);
    this.load.spritesheet("skill_punch","assets/fight/skills/skill_punch.png",48,48);
    this.load.spritesheet("skill_entangle","assets/fight/skills/skill_entangle.png",48,48);
    this.load.spritesheet("skill_punch_animation","assets/fight/skills/skill_punch_animation.png",128,128);
    this.load.spritesheet("skill_health_animation","assets/fight/skills/skill_health_animation.png",128,128);
    this.load.spritesheet("skill_ignite_animation","assets/fight/skills/skill_ignite_animation.png",128,128);
    this.load.spritesheet("skill_poison_animation","assets/fight/skills/skill_poison_animation.png",128,128);
    this.load.spritesheet("skill_entangle_animation","assets/fight/skills/skill_entangle_animation.png",128,128);

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
    this.load.image("cart_full", "assets/entities/cart_full.png");
    this.load.image("bucket_full", "assets/entities/bucket_full.png");
    this.load.image("bucket_empty", "assets/entities/bucket_empty.png");
    this.load.image("cage_animal_1", "assets/entities/cage_animal_1.png");
    this.load.image("bower_1", "assets/entities/bower_1.png");
    this.load.image("bower_2", "assets/entities/bower_2.png");
    this.load.image("bower_3", "assets/entities/bower_3.png");
    // houses
    this.load.image("house2", "assets/entities/houses/house2.png");
    this.load.image("house_cottage_1", "assets/entities/houses/house_cottage_1.png");
    this.load.image("house_cottage_big", "assets/entities/houses/house_cottage_big.png");
    this.load.image("house_cottage_big_2", "assets/entities/houses/house_cottage_big_2.png");

    // houses second maps
    this.load.image("house_semitown_big_1", "assets/entities/houses/house_semitown_big_1.png");
    this.load.image("house_semitown_big_2", "assets/entities/houses/house_semitown_big_2.png");
    this.load.image("house_semitown_long_1", "assets/entities/houses/house_semitown_long_1.png");
    this.load.image("house_semitown_small_1", "assets/entities/houses/house_semitown_small_1.png");
    this.load.image("house_semitown_small_2", "assets/entities/houses/house_semitown_small_2.png");
    this.load.image("house_semitown_small_3", "assets/entities/houses/house_semitown_small_3.png");
    this.load.image("house_semitown_small_4", "assets/entities/houses/house_semitown_small_4.png");
    this.load.image("house_semitown_small_5", "assets/entities/houses/house_semitown_small_5.png");
    this.load.image("house_semitown_small_6", "assets/entities/houses/house_semitown_small_6.png");

    // enemies
    this.load.spritesheet("spider", "assets/enemies/spider.png",45 ,40);
    this.load.image("spiderlogo", "assets/enemies/spiderlogo.png");
    this.load.spritesheet("bee", "assets/enemies/bee.png",32 ,32);
    this.load.image("beelogo", "assets/enemies/spiderlogo.png");

    // mobs
    this.load.spritesheet("chicken", "assets/entities/mobs/chicken.png",32 ,32);
    this.load.spritesheet("cow", "assets/entities/mobs/cow.png",80 ,80);
    this.load.spritesheet("pig", "assets/entities/mobs/pig.png",60 ,60);
    this.load.spritesheet("cat", "assets/entities/mobs/cat.png",30 ,30);
    this.load.spritesheet("dog", "assets/entities/mobs/dog.png",32 ,32);
    this.load.spritesheet("butterfly", "assets/entities/mobs/butterfly.png",16 ,32);

    /* UI */
    // bars [health bar/ experience bar etc]
    this.load.image("healthBar", "assets/UI/bars/healthBar.png");
    this.load.image("healthBarDark", "assets/UI/bars/healthBarDark.png");
    this.load.image("experienceBar", "assets/UI/bars/experienceBar.png");
    this.load.image("experienceBarDark", "assets/UI/bars/experienceBarDark.png");
    this.load.image("manaBar", "assets/UI/bars/manaBar.png");
    this.load.image("manaBarDark", "assets/UI/bars/manaBarDark.png");

    // player logo
    this.load.image("playerlogo", "assets/UI/bottomUI/playerlogo.png");

    // other ui stuff
    this.load.image("leftTile","assets/UI/bottomUI/tiles/leftTile.png");
    this.load.image("rightTile","assets/UI/bottomUI/tiles/rightTile.png");
    this.load.image("normalTile","assets/UI/bottomUI/tiles/normalTile.png");
    this.load.image("middleTile","assets/UI/bottomUI/tiles/middleTile.png");
    this.load.spritesheet("expandArrow","assets/UI/bottomUI/expansionMenu/expandArrow.png",50,50);
    this.load.spritesheet("eqIcon","assets/UI/bottomUI/expansionMenu/eqIcon.png",50,50);
    this.load.spritesheet("missionsIcon","assets/UI/bottomUI/expansionMenu/missionsIcon.png",50,50);
    this.load.spritesheet("statusIcon","assets/UI/bottomUI/expansionMenu/statusIcon.png",50,50);
    this.load.spritesheet("characterDataIcon","assets/UI/bottomUI/expansionMenu/characterDataIcon.png",50,50);
    this.load.image("backgroundIcons","assets/UI/bottomUI/expansionMenu/background.png");
    this.load.spritesheet("checkBox","assets/UI/checkbox.png",50,50);
  },
  create(){
    this.game.state.start("HomeState");
  }
}
