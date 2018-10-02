let ChangeMapState = {
  init : function (){
  },
  create() {
    this.game.state.states.GameState = null;
    this.game.state.add("GameState", GameState);
    this.game.state.start("GameState");
  }
}
