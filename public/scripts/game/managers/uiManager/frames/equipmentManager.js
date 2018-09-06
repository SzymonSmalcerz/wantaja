class EquipmentManager extends UIFrameManager {
  constructor(state,uiManager){
    super(state,uiManager,Phaser.Keyboard.V,null,'equipmentFrame');
    this.getPositionsCoords();
  }

  initialize() {
    // let state = this.state;
    // state.optionsManager = this.frameGroup;
    //
    // this.checkBox = new CheckBox(this.state.game,0,0,true,0,1,2,3,4,5,6,7);
    // this.uiManager.blockPlayerMovementsWhenOver(this.checkBox);
    // this.number = 0;
    // this.checkBox.addOnCheckFunction(function(){
    //   this.uiManager.showEnemiesDescriptions();
    // }, this)
    // this.checkBox.addOnUncheckFunction(function(){
    //   this.uiManager.hideEnemiesDescriptions();
    // }, this)
    //
    // this.enemiesDescriptionsText = state.add.text();
    // this.enemiesDescriptionsText.anchor.setTo(0,0.5);
    // this.enemiesDescriptionsText.text = "show enemies\ndescriptions:"
    // this.state.styleText(this.enemiesDescriptionsText);
    // this.frameGroup.add(this.checkBox);
    // this.frameGroup.add(this.enemiesDescriptionsText);
    //
    // this.frameGroup.fixedToCamera = true;
    //
    //
    // this.settingsButton = new Button(state.game,0,0,"settingsButton",0,1,2,3);
    // this.settingsButton.anchor.setTo(0);
    // this.settingsButton.addOnInputDownFunction(function(){
    //   this.toggleWindow();
    // },this);
    // this.uiManager.blockPlayerMovementsWhenOver(this.settingsButton);
    // this.uiManager.addToGroup(this.settingsButton);

    this.hideWindow();
    this.onResize();
  }


  getPositionsCoords() {
    super.getPositionsCoords();
    this.positions = {
    }
  }

  onResize() {
    this.getPositionsCoords();
    super.onResize();
  }
}
