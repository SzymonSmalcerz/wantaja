/*
  bridge between player and enemy while they fighting
  also initialize fighting stage and handle win/lose fight
*/

class FightingStageManager {
  constructor(state){
    this.state = state;
    this.skillsCss = {
      diff : 4, // how much space each skill will take
      skillSpriteWidth : 48,
      h : 120, // distance from bottom of the world of skill sprite
      left : 0 // distance from left edge of the game of first skill sprite
    };
  };

  initialize(){
    let state = this.state;
    state.fightingStage = state.add.group();


    state.fightingStageBackground = state.add.sprite(state.game.width/2,state.game.width/2,"fightingBackgroungFirstMap");
    state.fightingStageBackground.anchor.setTo(0.5);
    state.enemyLogo = state.game.add.sprite(state.game.width - 78,8,"spiderlogo");
    state.emptyHpBarEnemy = state.game.add.sprite(state.game.width - 210,15,"healthBarDark");
    state.fullHpBarEnemy = state.game.add.sprite(state.game.width - 210,15,"healthBar");

    this.setSkillsUI();
    let self = this;

    state.emitter = state.game.add.emitter();
    state.emitter.makeParticles("bloodParticle");
    state.emitter.minParticleSpeed.setTo(-35,-10);
    state.emitter.maxParticleSpeed.setTo(35,45);
    state.emitter.gravity = 0;

    state.fightingStage.add(state.fightingStageBackground);
    state.fightingStage.add(state.skill_punch);
    state.fightingStage.add(state.skill_health);
    state.fightingStage.add(state.skill_mana);
    state.fightingStage.add(state.skill_sword);
    state.fightingStage.add(state.skill_poison);
    state.fightingStage.add(state.emitter);
    state.fightingStage.add(state.enemyLogo);
    state.fightingStage.add(state.emptyHpBarEnemy);
    state.fightingStage.add(state.fullHpBarEnemy);

    state.fightingStage.visible = false;
    state.fightingStage.fixedToCamera = true;


    this.createFightingOptionsMenu();
    this.createSkillDescriptionInfos();
    this.createWonAlert();





  };


  createWonAlert(){
    let state = this.state;
    state.wonAlert = state.add.group();

    state.wonInfo = state.game.add.sprite(state.game.width/2,state.game.height/2,"wonInfo");
    state.wonInfo.anchor.setTo(0.5);
    state.okButton = state.add.button(state.game.width/2,state.game.height/2 + 15,"okButton",null,null,1,0,1,0);
    state.okButton.anchor.setTo(0.5);

    state.wonAlert.add(state.wonInfo);
    state.wonAlert.add(state.okButton);
    state.wonAlert.fixedToCamera = true;
    state.wonAlert.visible = false;
  };

  createFightingOptionsMenu(){
    let state = this.state;
    state.fightingOptionsMenu = state.add.group();

    state.fightInitButton = state.add.button(-100,-100,"fightInitButton",null,null,1,0,1,0);
    state.fightInitButton.anchor.setTo(0.5);
    state.fightAbortButton = state.add.button(-100,-100,"fightAbortButton",null,null,1,0,1,0);
    state.fightAbortButton.anchor.setTo(0.5);
    state.fightingOptionsMenu.add(state.fightInitButton);
    state.fightingOptionsMenu.add(state.fightAbortButton);

    state.fightingOptionsMenu.visible = false;
  };


  createSkillDescriptionInfos() {
    let state = this.state;
    state.skillDescriptions = state.add.group();

    state.skill_punch_description = state.game.add.sprite(state.game.width/2,state.game.height/2,"skill_punch_description");
    state.skill_punch_description.anchor.setTo(0.5);

    state.skillDescriptions.add(state.skill_punch_description);
    state.skillDescriptions.setAll("visible",false);
    state.skillDescriptions.fixedToCamera = true;
  };

  updateEnemyHealth() {
    let state = this.state;
    state.fullHpBarEnemy.width = state.player.opponent.health/state.player.opponent.maxHealth * state.emptyHpBarEnemy.width;
  };

  setEnemy(enemy){
    this.enemy = enemy;
  };

  damageEnemy(typeOfDamage){
    let self = this;
    handler.socketsManager.emit("damageEnemy",{
      playerID : self.state.player.id,
      attackName : typeOfDamage
    });
  };

  showFightOptionsMenu(enemy) {
    if(this.state.player.isFighting){return};
    this.state.player.isFighting = true; // player wont send any data about his position to the server while fighting
    this.state.fightInitButton.reset(enemy.x, enemy.y - 25);
    this.state.fightAbortButton.reset(enemy.x, enemy.y + 25);

    this.state.fightInitButton.onInputDown.addOnce(function(){
      this.startFight(enemy);
      this.state.fightingOptionsMenu.visible = false;
      this.state.playerMoveManager.lastTimeInputRead = Date.now();
    },this);
    this.state.fightAbortButton.onInputDown.addOnce(function(){
      this.state.player.isFighting = false;
      this.state.fightingOptionsMenu.visible = false;
      this.state.playerMoveManager.lastTimeInputRead = Date.now();
    },this);
    this.state.fightingOptionsMenu.visible = true;
  };

  initFight(enemy){
    let player = this.state.player;
    let state = this.state;
    this.currentEnemy = enemy;
    player.isFighting = true; // player wont send any data about his position to the server while fighting
    player.frame = 1;
    player.opponent = enemy;
    state.fightingStage.visible = true;
    enemy.oldCoords = {
      x : enemy.x,
      y : enemy.y
    };
    player.oldCoords = {
      x : player.x,
      y : player.y
    }
    state.enemyLogo.loadTexture(enemy.key + "logo");
    enemy.x = state.game.width/2 + 50;
    enemy.y = state.game.height/2 - 45;

    player.x = state.game.width/2 - 50;
    player.y = state.game.height/2 + 70;

    state.fightingStage.add(player);
    state.fightingStage.add(enemy);
    player.bringToTop();
    enemy.bringToTop();

    // this.state.skill_punch.onInputDown.addOnce(function(){
    //   this.handleWinFight({
    //     enemyID : enemy.id
    //   });
    // },this);
  };

  startFight(enemy){
    let player = this.state.player;
    handler.socketsManager.emit("initFight",{
      playerID : player.id,
      enemyID : enemy.id
    })
  };

  handleWinFight(){
    let player = this.state.player;
    this.state.wonAlert.visible = true;
    this.state.player.opponent.health = 0;
    this.updateEnemyHealth();
    this.state.okButton.onInputDown.addOnce(function(){
      let player = this.state.player;
      player.reset(player.oldCoords.x, player.oldCoords.y);
      this.state.fightingStage.visible = false;
      this.state.allEntities.add(player);
      player.isFighting = false;
      this.state.playerMoveManager.lastTimeInputRead = Date.now();
      this.state.wonAlert.visible = false;
    },this);
  };

  onResize(){
    let state = this.state;
    this.skillsCss.left = this.getLeftSkillMargin(5);
    state.skill_punch.reset(this.skillsCss.left,state.game.height - this.skillsCss.h);
    state.skill_health.reset(this.skillsCss.left + (this.skillsCss.skillSpriteWidth + this.skillsCss.diff),state.game.height - this.skillsCss.h);
    state.skill_poison.reset(this.skillsCss.left + (this.skillsCss.skillSpriteWidth + this.skillsCss.diff) * 2,state.game.height - this.skillsCss.h)
    state.skill_mana.reset(this.skillsCss.left + (this.skillsCss.skillSpriteWidth + this.skillsCss.diff) * 3,state.game.height - this.skillsCss.h)
    state.skill_sword.reset(this.skillsCss.left + (this.skillsCss.skillSpriteWidth + this.skillsCss.diff) * 4,state.game.height - this.skillsCss.h);
    state.enemyLogo.reset(state.game.width - 78,8);
    state.emptyHpBarEnemy.reset(state.game.width - 210,15);
    state.fullHpBarEnemy.reset(state.game.width - 210,15);

    state.wonInfo.reset(state.game.width/2,state.game.height/2);
    state.okButton.reset(state.game.width/2,state.game.height/2 + 15);
  };


  getLeftSkillMargin(howManySkills = 5){
    return (this.state.game.width - (howManySkills - 1) * (this.skillsCss.skillSpriteWidth + this.skillsCss.diff) - this.skillsCss.skillSpriteWidth)/2 + this.skillsCss.skillSpriteWidth/2;
  };

  setSkillsUI(){
    let state = this.state;
    let self = this;
    this.skillsCss = {
      diff : 4, // how much space each skill will take
      skillSpriteWidth : 48,
      h : 120, // distance from bottom of the world of skill sprite
      left : 0 // distance from left edge of the game of first skill sprite
    };
    this.skillsCss.left = this.getLeftSkillMargin(5);
    state.skill_punch = state.game.add.button(this.skillsCss.left,state.game.height - this.skillsCss.h,"skill_punch",function(){
      self.damageEnemy("punch");
    },1,1,0,0);
    state.skill_punch.onInputOver.add(function(){
      this.state.skill_punch_description.visible = true;
    },this);
    state.skill_punch.onInputOut.add(function(){
      this.state.skill_punch_description.visible = false;
    },this);
    state.skill_punch.anchor.setTo(0.5);
    state.skill_health = state.game.add.button(this.skillsCss.left + (this.skillsCss.skillSpriteWidth + this.skillsCss.diff),state.game.height - this.skillsCss.h,"skill_health",function(){
      self.damageEnemy("health");
    },1,1,0,0);
    state.skill_health.anchor.setTo(0.5);
    state.skill_poison = state.game.add.button(this.skillsCss.left + (this.skillsCss.skillSpriteWidth + this.skillsCss.diff) * 2,state.game.height - this.skillsCss.h,"skill_poison",function(){
      self.damageEnemy("poison");
    },1,1,0,0);
    state.skill_poison.anchor.setTo(0.5);
    state.skill_mana = state.game.add.button(this.skillsCss.left + (this.skillsCss.skillSpriteWidth + this.skillsCss.diff) * 3,state.game.height - this.skillsCss.h,"skill_mana",function(){
      self.damageEnemy("mana");
    },1,1,0,0);
    state.skill_mana.anchor.setTo(0.5);
    state.skill_sword = state.game.add.button(this.skillsCss.left + (this.skillsCss.skillSpriteWidth + this.skillsCss.diff) * 4,state.game.height - this.skillsCss.h,"skill_sword",function(){
      self.damageEnemy("sword");
    },1,1,0,0);
    state.skill_sword.anchor.setTo(0.5);
  }
}
