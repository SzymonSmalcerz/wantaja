class UIManager {
  constructor(state){
    this.state = state;
    this.statusPointsManager = new StatusPointsManager(state,this);
    this.uiClickCounter = 0;
  }

  initialize() {
    let state = this.state;

    // uiTileSprite
    state.uiTile_normal = state.add.tileSprite(40,state.game.height-70,state.game.width - 80,70,"normalTile");
    state.uiTile_left = state.add.sprite(0,state.game.height-70,"leftTile");
    state.uiTile_right = state.add.sprite(state.game.width-70,state.game.height-70,"rightTile");
    state.uiTile_middle = state.add.sprite(state.game.width/2 - 50,state.game.height-100,"middleTile");

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

    //expandArrow
    state.expandArrow = new Button(state.game,state.game.width-70,state.game.height-60,"expandArrow",0,1,2,3);
    state.expandArrow.anchor.setTo(0);
    state.expandArrow.addOnInputDownFunction(function(){
      this.uiClickCounter = 5;
      this.state.eqIcon.visible = !this.state.eqIcon.visible;
      this.state.statusIcon.visible = !this.state.statusIcon.visible;
      this.state.missionsIcon.visible = !this.state.missionsIcon.visible;
      this.state.backgroundIcons.visible = !this.state.backgroundIcons.visible;
    },this);

    state.eqIcon = new Button(state.game,state.game.width-210,state.game.height-147,"eqIcon",0,1,2,3);
    state.eqIcon.anchor.setTo(0);
    state.eqIcon.visible = false;
    state.statusIcon = new Button(state.game,state.game.width-150,state.game.height-147,"statusIcon",0,1,2,3);
    state.statusIcon.anchor.setTo(0);
    state.statusIcon.visible = false;
    state.missionsIcon = new Button(state.game,state.game.width-90,state.game.height-147,"missionsIcon",0,1,2,3);
    state.missionsIcon.anchor.setTo(0);
    state.missionsIcon.visible = false;
    state.backgroundIcons = state.game.add.sprite(state.game.width-245,state.game.height-170,"backgroundIcons");
    state.backgroundIcons.visible = false;



    //adding everything to one group
    state.ui = state.add.group();

    state.ui.add(state.uiTile_normal);
    state.ui.add(state.uiTile_right);
    state.ui.add(state.uiTile_left);
    state.ui.add(state.uiTile_middle);

    state.ui.add(state.playerlogo);

    state.ui.add(state.backgroundIcons);
    state.ui.add(state.expandArrow);
    state.ui.add(state.eqIcon);
    state.ui.add(state.statusIcon);
    state.ui.add(state.missionsIcon);

    state.ui.add(state.emptyHpBar);
    state.ui.add(state.fullHpBar);
    // state.ui.add(state.emptyManaBar);
    // state.ui.add(state.fullManaBar);
    state.ui.add(state.emptyExpBar);
    state.ui.add(state.fullExpBar);

    state.ui.fixedToCamera = true;

    this.statusPointsManager.initialize();
    this.onResize();
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

    state.expandArrow.reset(state.game.width-60,state.game.height-60);
    this.statusPointsManager.onResize();
  };

  update() {
    // console.log(this.uiClickCounter);
    this.uiClickCounter -= 1;// jezeli jest wieksze od 0 to player nie moze wykonac ruchu ! zapobiega to na 2 ticki ruch playera (zeby player nie poszedl na dol ekrany jak kliknie expandArrowa)
    // TODO nie trzeba updatowac tego caly czas !!!! jedynie jak dostaniemy info od servera, ze hp/mana/exp playera sie zmienil !!!!
    let state = this.state;
    state.fullHpBar.width = state.player.health/state.player.maxHealth * state.emptyHpBar.width;
    state.fullManaBar.width = state.player.mana/state.player.maxMana * state.emptyManaBar.width;
    state.fullExpBar.width = state.player.experience/state.player.requiredExperience * state.emptyExpBar.width;
    this.statusPointsManager.update();
  }
}
