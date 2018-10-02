/*
  bridge between player and enemy while they fighting
  also initialize fighting stage and handle win/lose fight
*/

class FightWithOpponentManager extends Phaser.Group {

  constructor(state) {
    super(state.game);

    this.state = state;
    this.fightingStageUIManager = new FightingStageUIManager(this);
    this.preFightMenu = new PreFightMenu(this);
    this.glowingSwordsManager = new GlowingSwordsManager(this);

    this.add(this.preFightMenu);
    this.add(this.glowingSwordsManager);
    this.add(this.fightingStageUIManager);
  };

  initialize() {
    this.fightingStageUIManager.initialize();
    this.preFightMenu.initialize();
    this.glowingSwordsManager.initialize();
    this.onResize();
  };

  onChangeMap() {
    this.glowingSwordsManager.onChangeMap();
  }

  updateStageUI() {
    this.fightingStageUIManager.updateStageUI();
  }

  updateEnemyHealth(enemyHealth) {
    this.fightingStageUIManager.updateEnemyHealth(enemyHealth);
  };

  initEnemyHealth() {
    console.log("JAKIS BLAD :)");
    this.fightingStageUIManager.initEnemyHealth();
  }

  setEnemy(enemy) {
    this.enemy = enemy;
  };

  damageEnemy(typeOfDamage) {
    let self = this;
    handler.socketsManager.emit("damageEnemy", {
      skillName : typeOfDamage
    });
  };

  animateEnemySkill(skillData) {
    this.fightingStageUIManager.animateEnemySkill(skillData);
  };

  showFightOptionsMenu(enemy) {
    this.preFightMenu.showFightOptionsMenu(enemy);
  }

  initFight(enemy) {
    let player = this.state.player;
    let state = this.state;
    this.currentEnemy = enemy;
    this.state.setFightingModeOn();
    player.setFightingMode(); // player wont send any data about his position to the server while fighting
    player.opponent = enemy;
    this.fightingStageUIManager.showWindow()
    enemy.oldCoords = {
      x : enemy.x,
      y : enemy.y
    };
    player.oldCoords = {
      x : player.x,
      y : player.y
    }

    this.fightingStageUIManager.initializeFight(player, enemy);
  };

  renderSwords(data) {
    if(data.enemyID) {
      this.glowingSwordsManager.addNewSword(this.state.allEntities.enemies[data.enemyID]);
    }
    if(data.playerID && this.state.allEntities.objects[data.playerID]) {
      this.glowingSwordsManager.addNewSword(this.state.allEntities.objects[data.playerID]);
    }
  }

  removeSwords(data) {
    if(data.enemyID) {
      this.glowingSwordsManager.removeSword(this.state.allEntities.enemies[data.enemyID]);
    }
    if(data.playerID && this.state.allEntities.objects[data.playerID]) {
      this.glowingSwordsManager.removeSword(this.state.allEntities.objects[data.playerID]);
    }
  }

  startFight(enemy) {
    let player = this.state.player;
    handler.socketsManager.emit("initFight",{
      playerID : player.id,
      enemyID : enemy.id
    })
  };

  handleWinFight(data) {
    let player = this.state.player;
    this.fightingStageUIManager.showWonWindow(data);
    this.state.player.opponent.kill();
    this.updateEnemyHealth(0);
    this.fightingStageUIManager.hideSkillsButtons();
    this.fightingStageUIManager.activateEndOfFightButton(function() {
      this.state.playerMoveManager.lastTimeInputRead = Date.now();
      this.state.setFightingModeOff();
      this.fightingStageUIManager.fightModeOff();
    },this);
  };

  onResize() {
    this.preFightMenu.onResize();
    this.fightingStageUIManager.onResize();
    this.glowingSwordsManager.onResize();
  };

  bringToTop() {
    this.game.world.bringToTop(this);
  }

  onMapChange() {
    this.fightingStageUIManager.onMapChange();
    this.preFightMenu.onMapChange();
    this.glowingSwordsManager.onMapChange();
    this.removeAll(true);
  }

}
