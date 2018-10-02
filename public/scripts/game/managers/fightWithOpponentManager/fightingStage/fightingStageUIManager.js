class FightingStageUIManager extends Phaser.Group {
  constructor(fightWithOpponentManager) {
    super(fightWithOpponentManager.state.game);
    this.state = fightWithOpponentManager.state;
    this.game = this.state.game;
    this.fightWithOpponentManager = fightWithOpponentManager;
    this.skillsUIManager = new SkillsUIManager(this);
    this.winUIManager = new WinUIManager(this);

    this.add(this.skillsUIManager);
    this.add(this.winUIManager);
  };

  initialize() {

    let state = this.state;

    this.fightingStageBackground = state.add.sprite(state.game.width/2,state.game.width/2,handler.fightingStageBackground);
    this.fightingStageBackground.anchor.setTo(0.5);
    this.enemyLogoBackground = state.game.add.sprite(state.game.width - 100,5,"enemylogo");
    this.enemyLogoBackground.anchor.setTo(0.5);
    this.enemyLogoFront = state.game.add.sprite(state.game.width - 100,5,"enemylogo");
    this.enemyLogoFront.anchor.setTo(0.5);
    this.emptyHpBarEnemy = state.game.add.sprite(state.game.width - 210,15,"healthBarDark");
    this.fullHpBarEnemy = state.game.add.sprite(state.game.width - 210,15,"healthBar");

    this.enemyHealthText = this.state.add.text(-500,-500);
    this.enemyHealthText.smoothed = false;
    handler.styleText(this.enemyHealthText);
    this.enemyHealthText.anchor.setTo(0,0);
    this.enemyHealthText.fontSize = 20;

    this.enemyDescription = this.state.add.text(-500,-500);
    this.enemyDescription.smoothed = false;
    handler.styleText(this.enemyDescription);
    this.enemyDescription.anchor.setTo(0.5);
    this.enemyDescription.fontSize = 26;

    // uiTileSprite
    this.tileHeight = 110;
    this.uiGroupTile_normal = state.add.tileSprite(40,0,state.game.width - 80,this.tileHeight,"normalTileUp");
    this.uiGroupTile_left = state.add.sprite(0,0,"leftTileUp");
    this.uiGroupTile_right = state.add.sprite(state.game.width-this.tileHeight,0,"rightTileUp");
    this.uiGroupTile_middle = state.add.sprite(state.game.width/2 - 50,0,"middleTileUp");

    this.emitter = state.game.add.emitter();
    this.emitter.makeParticles("bloodParticle");
    this.emitter.minParticleSpeed.setTo(-35,-10);
    this.emitter.maxParticleSpeed.setTo(35,45);
    this.emitter.gravity = 0;

    this.add(this.fightingStageBackground);
    this.add(this.uiGroupTile_normal);
    this.add(this.uiGroupTile_left);
    this.add(this.uiGroupTile_right);
    this.add(this.uiGroupTile_middle);
    this.add(this.emitter);
    this.add(this.enemyLogoBackground);
    this.add(this.enemyLogoFront);
    this.add(this.emptyHpBarEnemy);
    this.add(this.fullHpBarEnemy);
    this.add(this.enemyHealthText);
    this.add(this.enemyDescription);

    let self = this;
    this.showSkillsButtons = function() {
      self.skillsUIManager.showSkillButtons();
    };

    this.hideSkillsButtons = function() {
      self.skillsUIManager.hideSkillButtons();
    };
    this.visible = false;
    this.fixedToCamera = true;

    this.skillsUIManager.initialize();
    this.winUIManager.initialize();
    // this.skillsUIManager.addSkillButtonsToStageGroup(this);

    this.onResize();
  };

  updateEnemyHealth(enemyHealthText) {
    this.state.player.opponent.health = enemyHealthText;
    this.fullHpBarEnemy.width = this.enemy.health/this.enemy.maxHealth * this.emptyHpBarEnemy.width;
    this.enemyHealthText.text = `hp: ${this.enemy.health}/${this.enemy.maxHealth}`;
  };

  initEnemyHealth() {
    this.fullHpBarEnemy.width = this.emptyHpBarEnemy.width;
    this.enemyHealthText.text = `hp: ${this.enemy.health}/${this.enemy.maxHealth}`;
  }

  updateStageUI() {
    this.skillsUIManager.updateStageUI();
  }

  animateEnemySkill(skillData) {
    this.skillsUIManager.animateEnemySkill(skillData);
  }

  bringToTop() {
    this.game.world.bringToTop(this);
  }

  sendToBackBackground() {
    this.sendToBack(this.fightingStageBackground);
  }

  addToGroup(sprite) {
    this.add(sprite);
  }

  showWindow() {
    this.visible = true;
    this.showSkillsButtons();
  }

  hideWindow() {
    this.visible = false;
    this.hideSkillsButtons();
  }

  hideSkillsButtons() {
    this.hideSkillsButtons();
  }

  onMapChange() {
    this.skillsUIManager.onMapChange();
    this.winUIManager.onMapChange();
    this.removeAll(true);
  }

  changeenemyLogoTexture(enemy) {
    this.enemyLogoFront.loadTexture(enemy.key);
    this.enemyLogoFront.frame = 0;
    let scale = 1;
    while(this.enemyLogoFront.width > this.enemyLogoBackground.width) {
      scale -= 0.05;
      this.enemyLogoFront.scale.setTo(scale);
    }

    while(this.enemyLogoFront.width < this.enemyLogoBackground.width) {
      scale += 0.01;
      this.enemyLogoFront.scale.setTo(scale);
    }
  }

  showWonWindow(data) {
    this.winUIManager.showWonWindow(data);
  }

  hideWonWindow() {
    this.winUIManager.hideWonWindow();
  }

  activateEndOfFightButton(functionn, context) {
    this.winUIManager.activateEndOfFightButton(functionn, context);
  }

  damageEnemy(skillName) {
    this.fightWithOpponentManager.damageEnemy(skillName);
  }

  initializeFight(player, enemy) {
    this.enemy = enemy;
    this.enemyDescription.text = this.enemy.key + " lvl." + this.enemy.lvl;
    this.player = player;
    this.setCoords();
    this.changeenemyLogoTexture(enemy);
    this.addToGroup(player);
    this.addToGroup(enemy);
    player.sendToBack();
    enemy.sendToBack();
    this.sendToBackBackground();
    this.initEnemyHealth();
    this.player.health = player.maxHealth;
    this.player.mana = player.maxMana;
  }

  fightModeOff() {
    this.player.reset(this.player.oldCoords.x, this.player.oldCoords.y);
    this.state.allEntities.add(this.player);
    this.player.quitFightingMode();
    this.enemy = null;
    this.player = null;
    this.hideWonWindow();
    this.hideWindow();
  }

  setCoords() {
    if(this.player) {
      this.player.x = this.state.game.width/2 - 50;
      this.player.y = this.state.game.height/2 + 70;
    }

    if(this.enemy) {
      this.enemy.x = this.state.game.width/2 + 50;
      this.enemy.y = this.state.game.height/2 - 45;
    }
  }

  onResize() {
    let state = this.state;
    this.fightingStageBackground.reset(state.game.width/2,state.game.width/2);
    this.uiGroupTile_normal.reset(40,0);
    this.uiGroupTile_normal.width = state.game.width - 80;
    this.uiGroupTile_normal.height = this.tileHeight;
    this.uiGroupTile_left.reset(0,0);
    this.uiGroupTile_right.reset(state.game.width-70,0);
    this.uiGroupTile_middle.reset(state.game.width/2 - 50,0);
    this.setCoords();
    this.enemyLogoBackground.reset(state.game.width - 64,45);
    this.enemyLogoFront.reset(state.game.width - 64,45);
    this.emptyHpBarEnemy.reset(state.game.width - 235, 60);
    this.enemyHealthText.reset(state.game.width - 235, 30);
    this.fullHpBarEnemy.reset(state.game.width - 235, 60);
    this.skillsUIManager.onResize();
    this.winUIManager.onResize();

    if(this.enemyDescription.text) {
      while(this.enemyDescription.width < this.state.game.width/4) {
        this.enemyDescription.fontSize +=1;
      }

      while(this.enemyDescription.width > this.state.game.width/4) {
        this.enemyDescription.fontSize -=1;
      }
    }

    if(this.state.game.width < 380) {
      this.enemyDescription.reset(state.game.width - 235, 10);
      this.enemyDescription.fontSize = 16;
      this.enemyDescription.anchor.setTo(0);
    } else {
      this.enemyDescription.reset(state.game.width/2 - 120, 45);
      this.enemyDescription.anchor.setTo(0.5);
    }


    this.setAll("smoothed", false);
  };
}
