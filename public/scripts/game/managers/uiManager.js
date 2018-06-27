class UIManager {
  constructor(state){
    this.state = state;
  }

  initialize() {
    let state = this.state;
    // health bars
    state.emptyHpBar = state.game.add.sprite(70,state.game.height - 70,"healthBarDark");
    state.fullHpBar = state.game.add.sprite(70,state.game.height - 70,"healthBar");

    //experience bars
    state.emptyManaBar = state.game.add.sprite(70,state.game.height - 48,"manaBarDark");
    state.fullManaBar = state.game.add.sprite(70,state.game.height - 48,"manaBar");

    //experience bars
    state.emptyExpBar = state.game.add.sprite(70,state.game.height - 26,"experienceBarDark");
    state.fullExpBar = state.game.add.sprite(70,state.game.height - 26,"experienceBar");

    //player logo
    state.playerlogo = state.game.add.sprite(2,state.game.height - 72,"playerlogo");



    //adding everything to one group
    state.ui = state.add.group();
    state.ui.add(state.playerlogo);
    state.ui.add(state.emptyHpBar);
    state.ui.add(state.fullHpBar);
    state.ui.add(state.emptyManaBar);
    state.ui.add(state.fullManaBar);
    state.ui.add(state.emptyExpBar);
    state.ui.add(state.fullExpBar);
    // state.ui.callAll("anchor.setTo","anchor", 0.5);

    state.ui.fixedToCamera = true;
    this.onResize();
  }

  onResize() {
    let state = this.state;
    state.emptyHpBar.reset(70,state.game.height - 65);
    state.fullHpBar.reset(70,state.game.height - 65);
    state.emptyManaBar.reset(70,state.game.height - 48);
    state.fullManaBar.reset(70,state.game.height - 48);
    state.emptyExpBar.reset(70,state.game.height - 31);
    state.fullExpBar.reset(70,state.game.height - 31);
    state.playerlogo.reset(2,state.game.height - 72);
  };

  update() {
    // TODO nie trzeba updatowac tego caly czas !!!! jedynie jak dostaniemy info od servera, ze hp/mana/exp playera sie zmienil !!!!
    let state = this.state;
    state.fullHpBar.width = state.player.health/state.player.maxHealth * state.emptyHpBar.width;
    state.fullManaBar.width = state.player.mana/state.player.maxMana * state.emptyManaBar.width;
    state.fullExpBar.width = state.player.experience/state.player.requiredExperience * state.emptyExpBar.width;
  }
}
