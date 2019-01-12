class PreFightMenu extends Phaser.Group {
  constructor(fightWithOpponentManager) {
    super(fightWithOpponentManager.state.game);
    this.state = fightWithOpponentManager.state;
    this.fightWithOpponentManager = fightWithOpponentManager;
  };

  initialize() {
    this.createFightingOptionsMenu();
  };

  createFightingOptionsMenu() {
    let state = this.state;

    this.fightInitButton = new Button(this.state,-100,-100,"fightInitButton",0,0,1,2);
    this.fightInitButton.anchor.setTo(0.5);
    this.fightAbortButton = new Button(this.state,-100,-100,"closeButton",0,0,1,2);
    this.fightAbortButton.anchor.setTo(0.5);
    this.add(this.fightInitButton);
    this.add(this.fightAbortButton);

    this.visible = false;
  };

  onMapChange() {
    this.removeAll(true);
  }

  onResize() {}

  showFightOptionsMenu(enemy) {

    this.state.game.world.bringToTop(this);
    if(this.state.player.isFighting) {return};
    this.state.player.setFightingMode(); // player wont send any data about his position to the server while fighting
    this.fightInitButton.reset(enemy.x, enemy.y - 25);
    this.fightAbortButton.reset(enemy.x, enemy.y + 25);

    this.fightInitButton.addOnInputDownFunction(function() {
      this.fightWithOpponentManager.startFight(enemy);
      this.visible = false;
      this.state.playerMoveManager.lastTimeInputRead = Date.now();
    },this,true);

    this.fightAbortButton.addOnInputDownFunction(function() {
      this.state.player.quitFightingMode();
      this.visible = false;
      this.state.playerMoveManager.lastTimeInputRead = Date.now();
    },this,true);
    this.visible = true;
  };
};
