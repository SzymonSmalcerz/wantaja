class WinUIManager {
  constructor(mainFightManager){
    this.state = mainFightManager.state;
    this.mainFightManager = mainFightManager;
  };

  initialize(){
    this.createWonAlert();
  };

  createWonAlert(){
    let state = this.state;
    state.wonAlert = state.add.group();

    state.wonInfo = state.game.add.sprite(state.game.width/2,state.game.height/2,"wonInfo");
    state.wonInfo.anchor.setTo(0.5);
    state.okButton = new Button(state.game,state.game.width/2,state.game.height/2 + 15,"okButton",0,0,1,2);
    state.okButton.anchor.setTo(0.5);

    state.wonAlert.add(state.wonInfo);
    state.wonAlert.add(state.okButton);
    state.wonAlert.fixedToCamera = true;
    state.wonAlert.visible = false;
  };


  onResize(){
    let state = this.state;
    state.wonInfo.reset(state.game.width/2,state.game.height/2);
    state.okButton.reset(state.game.width/2,state.game.height/2 + 15);
  };
}
