let FightState = {
  create(){
    this.background = this.add.tileSprite(0,0,this.game.world.width,this.game.world.width,"fightSprite");

  },
  afterFight(){
    this.game.state.start("GameState");
  }
}
