class PreFightMenu {
  constructor(mainFightManager){
    this.state = mainFightManager.state;
    this.mainFightManager = mainFightManager;
  };

  initialize(){
    this.createFightingOptionsMenu();
  };

  createFightingOptionsMenu(){
    let state = this.state;
    state.fightingOptionsMenu = state.add.group();

    state.fightInitButton = new Button(this.state.game,-100,-100,"fightInitButton",0,0,1,2);
    state.fightInitButton.anchor.setTo(0.5);
    state.fightAbortButton = new Button(this.state.game,-100,-100,"fightAbortButton",0,0,1,2);
    state.fightAbortButton.anchor.setTo(0.5);
    state.fightingOptionsMenu.add(state.fightInitButton);
    state.fightingOptionsMenu.add(state.fightAbortButton);

    state.fightingOptionsMenu.visible = false;
  };

  showFightOptionsMenu(enemy) {
    if(this.state.player.isFighting){return};
    this.state.player.setFightingMode(); // player wont send any data about his position to the server while fighting
    this.state.fightInitButton.reset(enemy.x, enemy.y - 25);
    this.state.fightAbortButton.reset(enemy.x, enemy.y + 25);

    this.state.fightInitButton.addOnInputDownFunction(function(){
      this.mainFightManager.startFight(enemy);
      this.state.fightingOptionsMenu.visible = false;
      this.state.playerMoveManager.lastTimeInputRead = Date.now();
    },this,true);

    this.state.fightAbortButton.addOnInputDownFunction(function(){
      this.state.player.quitFightingMode();
      this.state.fightingOptionsMenu.visible = false;
      this.state.playerMoveManager.lastTimeInputRead = Date.now();
    },this,true);
    this.state.fightingOptionsMenu.visible = true;
  };
};
