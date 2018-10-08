class UIManager {
  constructor(state) {
    this.state = state;
    this.game = state.game;
    this.entityDescriptionsManager = new EntityDescriptionsManager(this);
    this.statusPointsManager = new StatusPointsManager(state,this);
    this.characterDataManager = new CharacterDataManager(state,this);
    this.settingsManager = new SettingsManager(state,this);
    this.equipmentManager = new EquipmentManager(state,this);

    this.tradeManager = new TradeManager(state,this);
    this.teleportManager = new TeleportManager(state,this);

    this.expandedMenuManager = new ExpandedMenuManager(state,this);
    this.alertManager = new AlertManager(this);
    this.fightMode = false;
  }

  showTownAlert(text) {
    this.alertManager.showTownAlert(text);
  }
  showDamageEnemyAlert(text) {
    this.alertManager.showDamageEnemyAlert(text);
  }
  showDamagePlayerAlert(text) {
    this.alertManager.showDamagePlayerAlert(text);
  }
  showHealthAlert(text) {
    this.alertManager.showHealthAlert(text);
  }
  showSomeoneElseFightingAlert() {
    this.alertManager.showSomeoneElseFightingAlert();
  }
  showDodgeAlert(text) {
    this.alertManager.showDodgeAlert(text);
  }
  showLevelUpAlert(text) {
    this.alertManager.showLevelUpAlert(text);
  }
  showAlert(text) {
    this.alertManager.showWindow(text);
  }

  initialize() {
    this.framesManagers = [];
    this.framesManagers.push(this.statusPointsManager);
    this.framesManagers.push(this.characterDataManager);
    this.framesManagers.push(this.settingsManager);
    this.framesManagers.push(this.tradeManager);
    this.framesManagers.push(this.teleportManager);
    this.framesManagers.push(this.equipmentManager);
    let state = this.state;
    // uiTileSprite
    this.uiGroupTile_normal = state.add.tileSprite(40,state.game.height-70,state.game.width - 80,70,"normalTile");
    this.uiGroupTile_left = state.add.sprite(0,state.game.height-70,"leftTile");
    this.uiGroupTile_right = state.add.sprite(state.game.width-70,state.game.height-70,"rightTile");
    this.uiGroupTile_middle = state.add.sprite(state.game.width/2 - 50,state.game.height-100,"middleTile");

    this.blockPlayerMovementsWhenOver(this.uiGroupTile_normal);
    this.blockPlayerMovementsWhenOver(this.uiGroupTile_left);
    this.blockPlayerMovementsWhenOver(this.uiGroupTile_right);
    this.blockPlayerMovementsWhenOver(this.uiGroupTile_middle);

    this.moneyIcon = state.add.sprite(state.game.width/2 + 50,state.game.height-100,"moneyIcon");
    this.blockPlayerMovementsWhenOver(this.moneyIcon);

    this.moneyText = this.state.add.text(-500,-500);
    this.state.styleText(this.moneyText);
    let textCss = {
      stroke : '#000',
      strokeThickness : 4,
      fill : '	#DAA520'
    };
    this.moneyText.setStyle(textCss);
    this.moneyText.anchor.setTo(0,0.5);
    this.moneyText.fontSize = 18;
    this.moneyText.text = '0$';

    // health bars
    this.emptyHpBar = state.game.add.sprite(70,state.game.height - 55,"healthBarDark");
    this.fullHpBar = state.game.add.sprite(70,state.game.height - 55,"healthBar");

    //experience bars
    this.emptyManaBar = state.game.add.sprite(70,state.game.height - 48,"manaBarDark");
    this.fullManaBar = state.game.add.sprite(70,state.game.height - 48,"manaBar");
    this.emptyManaBar.visible = false;
    this.fullManaBar.visible = false;

    //experience bars
    this.emptyExpBar = state.game.add.sprite(70,state.game.height - 35,"experienceBarDark");
    this.fullExpBar = state.game.add.sprite(70,state.game.height - 35,"experienceBar");

    //player logo
    this.playerlogo = state.game.add.sprite(2,state.game.height - 72,"playerlogo");


    // state.uiGroup = state.add.group();
    // this.uiGroup = state.uiGroup;
    this.uiGroup = state.add.group();
    state.uiGroup = this.uiGroup;

    // state.game.add.existing(this.uiGroup);

    this.uiGroup.add(this.uiGroupTile_normal);
    this.uiGroup.add(this.uiGroupTile_right);
    this.uiGroup.add(this.uiGroupTile_left);
    this.uiGroup.add(this.uiGroupTile_middle);
    this.uiGroup.add(this.moneyText);
    this.uiGroup.add(this.moneyIcon);
    this.uiGroup.add(this.playerlogo);
    this.uiGroup.add(this.emptyHpBar);
    this.uiGroup.add(this.fullHpBar);
    this.uiGroup.add(this.emptyExpBar);
    this.uiGroup.add(this.fullExpBar);
    this.uiGroup.add(this.emptyManaBar);
    this.uiGroup.add(this.fullManaBar);

    this.uiGroup.fixedToCamera = true;
    this.entityDescriptionsManager.initialize();
    this.framesManagers.forEach(frameManager => {
      frameManager.initialize();
    });
    this.expandedMenuManager.initialize();
    this.alertManager.initialize();
    this.onResize();
    this.hideManaBar();
    this.hideHealthBar();
    this.updateMoneyText();
  }

  updateMoneyText() {
    this.moneyText.text = `${handler.money}$`;
  }

  addToGroup(sprite) {
    this.uiGroup.add(sprite);
  }

  hideEnemiesDescriptions() {
    this.entityDescriptionsManager.hideEnemiesDescriptions();
  }

  showEnemiesDescriptions() {
    this.entityDescriptionsManager.showEnemiesDescriptions();
  }

  addEnemyDescription(enemy) {
    this.entityDescriptionsManager.addEnemyDescription(enemy);
  }

  removeEnemyDescription(enemy) {
    this.entityDescriptionsManager.removeEnemyDescription(enemy);
  }

  blockPlayerMovementsWhenOver(sprite) {
    sprite.inputEnabled = true;
    sprite.events.onInputOver.add(function() {
      this.blockPlayerMovement(10000);
    },this);
    sprite.events.onInputDown.add(function() {
      this.blockPlayerMovement(10000);
    },this);
    sprite.events.onInputUp.add(function() {
      this.blockPlayerMovement();
    },this);
    sprite.events.onInputOut.add(function() {
      this.blockPlayerMovement();
    },this);
  }

  showTradeWindow(trader) {
    this.tradeManager.showWindow(trader);
  }

  showTeleportWindow(teleporter) {
    this.teleportManager.showWindow(teleporter);
  }

  toggleStatusPointWindow() {
    this.statusPointsManager.toggleWindow();
  }

  toggleEquipmentWindow() {
    this.equipmentManager.toggleWindow();
  }

  toggleCharacterDataWindow() {
    this.characterDataManager.toggleWindow();
  }

  blockPlayerMovement(num) {
    this.state.blockPlayerMovement(num);
  }

  unBlockPlayerMovement() {
    // this.blockedMovement = false;
  }

  fightModeOn() {
    if(this.state.game.width < 380) {
      this.moneyIcon.reset(15, this.state.game.height - 110 - 100);
      this.moneyText.reset(65, this.state.game.height - 89 - 100);
    }
    this.showManaBar();
    this.showHealthBar();
    this.fightMode = true;
  }

  fightModeOff() {
    this.hideManaBar();
    this.hideHealthBar();
    this.fightMode = false;
    if(this.state.game.width < 380) {
      this.moneyIcon.reset(15, this.state.game.height - 103);
      this.moneyText.reset(65, this.state.game.height - 76);
    }
  }

  showManaBar() {
    this.emptyManaBar.visible = true;
    this.fullManaBar.visible = true;
  }

  hideManaBar() {
    this.emptyManaBar.visible = false;
    this.fullManaBar.visible = false;
  }

  showHealthBar() {
    this.emptyHpBar.visible = true;
    this.fullHpBar.visible = true;
  }

  hideHealthBar() {
    this.emptyHpBar.visible = false;
    this.fullHpBar.visible = false;
  }

  closeAllWindows() {
    this.framesManagers.forEach(frameManager => {
      frameManager.hideWindow();
    });
  }

  update() {
    // TODO nie trzeba updatowac tego caly czas !!!! jedynie jak dostaniemy info od servera, ze hp/mana/exp playera sie zmienil !!!!
    let state = this.state;
    this.fullHpBar.width = state.player.health/state.player.maxHealth * this.emptyHpBar.width;
    this.fullManaBar.width = state.player.mana/state.player.maxMana * this.emptyManaBar.width;
    this.fullExpBar.width = state.player.experience/state.player.requiredExperience * this.emptyExpBar.width;
    this.expandedMenuManager.update();
    this.framesManagers.forEach(frameManager => {
      frameManager.update();
    });
  }

  onResize() {
    let state = this.state;
    this.emptyHpBar.reset(60, state.game.height - 55);
    this.fullHpBar.reset(60, state.game.height - 55);
    this.emptyManaBar.reset(60, state.game.height - 35);
    this.fullManaBar.reset(60, state.game.height - 35);
    this.emptyExpBar.reset(60, state.game.height - 35);
    this.fullExpBar.reset(60, state.game.height - 35);
    if(this.state.game.width < 380 && this.fightMode) {
      this.moneyIcon.reset(15, state.game.height - 110 - 100);
      this.moneyText.reset(65, state.game.height - 89 - 100);
    } else {
      this.moneyIcon.reset(15, state.game.height - 103);
      this.moneyText.reset(65, state.game.height - 76);
    }
    if(!this.fightMode) {
      this.fightModeOff();
    }

    this.playerlogo.reset(10,state.game.height - 60);

    this.uiGroupTile_normal.reset(40,state.game.height-70);
    this.uiGroupTile_normal.width = state.game.width - 80;
    this.uiGroupTile_normal.height = 70;
    this.uiGroupTile_left.reset(0,state.game.height-70);
    this.uiGroupTile_right.reset(state.game.width-70,state.game.height-70);
    this.uiGroupTile_middle.reset(state.game.width/2 - 50,state.game.height-100);

    this.framesManagers.forEach(frameManager => {
      frameManager.onResize();
    });
    this.expandedMenuManager.onResize();
  };

  onMapChange() {
    this.uiGroup.removeAll(true);
  }

  bringToTop(item) {
    this.game.world.bringToTop(this.uiGroup);
  }

  bringItemToTop(item) {
    this.uiGroup.bringToTop(item);
  }

}
