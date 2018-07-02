/*
  bridge between player and enemy while they fighting
  also initialize fighting stage and handle win/lose fight
*/

class FightWithOpponentManager {
  constructor(state){
    this.state = state;
    console.log(state);
    this.fightingStageUIManager = new FightingStageUIManager(this);
    this.preFightMenu = new PreFightMenu(this);
  };

  initialize(){
    this.fightingStageUIManager.initialize();
    this.preFightMenu.initialize();
    this.onResize();
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
      skillName : typeOfDamage
    });
  };

  animateEnemySkill(skillName){
    this.fightingStageUIManager.animateEnemySkill(skillName);
  };

  showFightOptionsMenu(enemy){
    this.preFightMenu.showFightOptionsMenu(enemy);
  }

  initFight(enemy){
    let player = this.state.player;
    let state = this.state;
    this.currentEnemy = enemy;
    player.isFighting = true; // player wont send any data about his position to the server while fighting
    player.frame = 1;
    player.opponent = enemy;
    state.fightingStage.visible = true;
    state.fightingStage.showSkillsButtons()
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
    this.state.fightingStage.hideSkillsButtons();
    this.state.okButton.addOnInputDownFunction(function(){
      let player = this.state.player;
      player.reset(player.oldCoords.x, player.oldCoords.y);
      this.state.fightingStage.visible = false;
      this.state.allEntities.add(player);
      player.isFighting = false;
      this.state.playerMoveManager.lastTimeInputRead = Date.now();
      this.state.wonAlert.visible = false;
    },this,true);
  };

  onResize(){
    this.fightingStageUIManager.onResize();
  };

}
