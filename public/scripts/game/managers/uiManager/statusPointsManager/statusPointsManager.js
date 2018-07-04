class StatusPointsManager {
  constructor(state,uiManager){
    this.state = state;
    this.uiManager = uiManager;
  }

  initialize() {
    let state = this.state;
    console.log("Xddd");
    state.statusPoints = state.add.group();
    // state.statusPointsBackground = state.game.add.sprite(state.game.world.width/2,state.game.world.height/2,"statusPoints");
    state.statusPointsBackground = state.game.add.sprite(state.game.width/2,state.game.height/2,"statusPoints");
    state.statusPointsBackground.anchor.setTo(0.5);

    
    state.ui.add(state.statusPointsBackground);
    state.statusPoints.fixedToCamera = true;
    this.onResize();
    console.log("Xddd");
  }

  onResize() {
    let state = this.state;
    console.log(":)");
  };
}
