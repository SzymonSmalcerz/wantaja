class UIManager {
  constructor(state){
    this.state = state;
  }

  initialize() {
    let state = this.state;
    // health bars
    state.emptyHpBar = state.game.add.sprite(70,state.game.height - 60,"healthBarDark");
    state.fullHpBar = state.game.add.sprite(70,state.game.height - 60,"healthBar");

    //experience bars
    state.emptyExpBar = state.game.add.sprite(70,state.game.height - 36,"experienceBarDark");
    state.fullExpBar = state.game.add.sprite(70,state.game.height - 36,"experienceBar");

    //player logo
    state.playerlogo = state.game.add.sprite(2,state.game.height - 72,"playerlogo");



    //adding everything to one group
    state.ui = state.add.group();
    state.ui.add(state.playerlogo);
    state.ui.add(state.emptyHpBar);
    state.ui.add(state.fullHpBar);
    state.ui.add(state.emptyExpBar);
    state.ui.add(state.fullExpBar);
    // state.ui.callAll("anchor.setTo","anchor", 0.5);

    state.ui.fixedToCamera = true;
    this.onResize();
  }

  onResize() {
    let state = this.state;
    state.emptyHpBar.reset(70,state.game.height - 60);
    state.fullHpBar.reset(70,state.game.height - 60);
    state.emptyExpBar.reset(70,state.game.height - 36);
    state.fullExpBar.reset(70,state.game.height - 36);
    state.playerlogo.reset(2,state.game.height - 72);
  };

  update() {
    let state = this.state;
    state.fullHpBar.width = state.player.health/state.player.maxHealth * state.emptyHpBar.width;
    state.fullExpBar.width = state.player.experience/state.player.requiredExperience * state.emptyExpBar.width;
  }
}
