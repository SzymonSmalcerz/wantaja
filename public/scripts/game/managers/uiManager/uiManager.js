class UIManager {
  constructor(state){
    this.state = state;
    this.statusPointsManager = new StatusPointsManager(state,this);
    this.expandedMenuManager = new ExpandedMenuManager(state,this);
    this.blockedMovement = false;
  }

  initialize() {
    let state = this.state;

    // uiTileSprite
    state.uiTile_normal = state.add.tileSprite(40,state.game.height-70,state.game.width - 80,70,"normalTile");
    state.uiTile_left = state.add.sprite(0,state.game.height-70,"leftTile");
    state.uiTile_right = state.add.sprite(state.game.width-70,state.game.height-70,"rightTile");
    state.uiTile_middle = state.add.sprite(state.game.width/2 - 50,state.game.height-100,"middleTile");

    this.blockPlayerMovementsWhenOver(state.uiTile_normal);
    this.blockPlayerMovementsWhenOver(state.uiTile_left);
    this.blockPlayerMovementsWhenOver(state.uiTile_right);
    this.blockPlayerMovementsWhenOver(state.uiTile_middle);
    // health bars
    state.emptyHpBar = state.game.add.sprite(70,state.game.height - 55,"healthBarDark");
    state.fullHpBar = state.game.add.sprite(70,state.game.height - 55,"healthBar");

    //experience bars
    state.emptyManaBar = state.game.add.sprite(70,state.game.height - 48,"manaBarDark");
    state.fullManaBar = state.game.add.sprite(70,state.game.height - 48,"manaBar");

    //experience bars
    state.emptyExpBar = state.game.add.sprite(70,state.game.height - 35,"experienceBarDark");
    state.fullExpBar = state.game.add.sprite(70,state.game.height - 35,"experienceBar");

    //player logo
    state.playerlogo = state.game.add.sprite(2,state.game.height - 72,"playerlogo");





    //adding everything to one group
    state.ui = state.ui || state.add.group();

    state.ui.add(state.uiTile_normal);
    state.ui.add(state.uiTile_right);
    state.ui.add(state.uiTile_left);
    state.ui.add(state.uiTile_middle);
    state.ui.add(state.playerlogo);
    state.ui.add(state.emptyHpBar);
    state.ui.add(state.fullHpBar);
    // state.ui.add(state.emptyManaBar);
    // state.ui.add(state.fullManaBar);
    state.ui.add(state.emptyExpBar);
    state.ui.add(state.fullExpBar);

    state.ui.fixedToCamera = true;

    this.statusPointsManager.initialize();
    this.expandedMenuManager.initialize();
    this.onResize();
  }

  blockPlayerMovementsWhenOver(sprite,releaseWhenInputUp){
    sprite.inputEnabled = true;
    sprite.events.onInputOver.add(function(){
      this.blockPlayerMovement();
    },this);
    sprite.events.onInputDown.add(function(){
      this.blockPlayerMovement();
    },this);
    sprite.events.onInputOut.add(function(){
      this.unBlockPlayerMovement();
    },this);

    if(releaseWhenInputUp){
      sprite.events.onInputUp.add(function(){
        this.unBlockPlayerMovement();
      },this);
    }
  }

  toggleStatusPointWindow(){
    this.statusPointsManager.toggleStatusPointWindow();
  }

  blockPlayerMovement(){
    this.blockedMovement = true;
  }

  unBlockPlayerMovement(){
    this.blockedMovement = false;
  }

  onResize() {
    let state = this.state;
    state.emptyHpBar.reset(60,state.game.height - 55);
    state.fullHpBar.reset(60,state.game.height - 55);
    state.emptyManaBar.reset(60,state.game.height - 48);
    state.fullManaBar.reset(60,state.game.height - 48);
    state.emptyExpBar.reset(60,state.game.height - 35);
    state.fullExpBar.reset(60,state.game.height - 35);
    state.playerlogo.reset(10,state.game.height - 60);

    state.uiTile_normal.reset(40,state.game.height-70);
    state.uiTile_normal.width = state.game.width - 80;
    state.uiTile_normal.height = 70;
    state.uiTile_left.reset(0,state.game.height-70);
    state.uiTile_right.reset(state.game.width-70,state.game.height-70);
    state.uiTile_middle.reset(state.game.width/2 - 50,state.game.height-100);

    this.expandedMenuManager.onResize();
    this.statusPointsManager.onResize();
  };

  update() {
    // TODO nie trzeba updatowac tego caly czas !!!! jedynie jak dostaniemy info od servera, ze hp/mana/exp playera sie zmienil !!!!
    let state = this.state;
    state.fullHpBar.width = state.player.health/state.player.maxHealth * state.emptyHpBar.width;
    state.fullManaBar.width = state.player.mana/state.player.maxMana * state.emptyManaBar.width;
    state.fullExpBar.width = state.player.experience/state.player.requiredExperience * state.emptyExpBar.width;
    this.statusPointsManager.update();
    this.expandedMenuManager.update();
  }
}
