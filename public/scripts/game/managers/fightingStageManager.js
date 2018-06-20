/*
  bridge between player and enemy while they fighting
  also initialize fighting stage and handle win/lose fight
*/

class FightingStageManager {
  constructor(handler){
    this.handler = handler;
  }

  initialize(state){
    state.fightingStage = state.add.group();


    console.log(state);
    state.fightingStageBackground = state.add.sprite(0,0,"fightingBackgroungFirstMap");
    state.enemyLogo = state.game.add.sprite(state.game.width - 78,8,"spiderlogo");
    state.emptyHpBarEnemy = state.game.add.sprite(state.game.width - 210,15,"healthBarDark");
    state.fullHpBarEnemy = state.game.add.sprite(state.game.width - 210,15,"healthBar");

    let self = this;
    state.fightingButtonPunch = state.game.add.button(8,500,"fightingButtonPunch",function(){
      self.damageEnemy("punch");
    });

    state.emitter = state.game.add.emitter();
    state.emitter.makeParticles("bloodParticle");
    state.emitter.minParticleSpeed.setTo(-35,-10);
    state.emitter.maxParticleSpeed.setTo(35,45);
    state.emitter.gravity = 0;

    state.fightingStage.add(state.fightingStageBackground);
    state.fightingStage.add(state.emitter);
    state.fightingStage.add(state.enemyLogo);
    state.fightingStage.add(state.emptyHpBarEnemy);
    state.fightingStage.add(state.fullHpBarEnemy);
    state.fightingStage.add(state.fightingButtonPunch);

    state.fightingStage.visible = false;
    state.fightingStage.fixedToCamera = true;
  }

  setEnemy(enemy){
    this.enemy = enemy;
  };

  damageEnemy(typeOfDamage){
    let self = this;
    self.handler.socket.emit("damageEnemy",{
      playerID : self.handler.playerID,
      enemyID : self.currentEnemy.id
    });
  };

  initFight(enemy,player,state){
    this.currentEnemy = enemy;
    player.isFighting = true; // player wont send any data about his position to the server while fighting
    player.frame = 1;
    console.log(state);
    state.fightingStage.visible = true;
    enemy.oldCoords = {
      x : enemy.x,
      y : enemy.y
    };
    player.oldCoords = {
      x : player.x,
      y : player.y
    }
    enemy.x = state.game.width/2 + 50;
    enemy.y = state.game.height/2 - 45;

    player.x = state.game.width/2 - 50;
    player.y = state.game.height/2 + 70;
    player.bringToTop();
    enemy.bringToTop();
    state.fightingStage.add(player);
    state.fightingStage.add(enemy);
  };
}
