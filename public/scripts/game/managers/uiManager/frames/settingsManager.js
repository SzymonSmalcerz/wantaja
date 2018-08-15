class SettingsManager extends UIFrameManager {
  constructor(state,uiManager){
    super(state,uiManager,Phaser.Keyboard.Z,'Settings');
    this.getPositionsCoords();
  }

  initialize() {
    let state = this.state;
    state.optionsManager = this.frameGroup;
    this.background = state.game.add.sprite(0,0,"frame");
    this.background.anchor.setTo(0.5);
    this.uiManager.blockPlayerMovementsWhenOver(this.background);

    this.checkBox = new CheckBox(this.state.game,0,0,true,0,1,2,3,4,5,6,7);
    this.uiManager.blockPlayerMovementsWhenOver(this.checkBox);
    this.number = 0;
    this.checkBox.addOnCheckFunction(function(){
      this.uiManager.showEnemiesDescriptions();
    }, this)
    this.checkBox.addOnUncheckFunction(function(){
      this.uiManager.hideEnemiesDescriptions();
    }, this)

    this.enemiesDescriptionsText = state.add.text();
    this.enemiesDescriptionsText.anchor.setTo(0,0.5);
    this.enemiesDescriptionsText.text = "show enemies\ndescriptions:"
    this.state.styleText(this.enemiesDescriptionsText);

    this.frameGroup.add(this.background);
    this.frameGroup.add(this.checkBox);
    this.frameGroup.add(this.enemiesDescriptionsText);

    this.frameGroup.fixedToCamera = true;


    this.settingsButton = new Button(state.game,0,0,"settingsButton",0,1,2,3);
    this.settingsButton.anchor.setTo(0);
    this.settingsButton.addOnInputDownFunction(function(){
      this.toggleWindow();
    },this);
    this.uiManager.blockPlayerMovementsWhenOver(this.settingsButton);
    this.uiManager.addToGroup(this.settingsButton);

    this.hideWindow();
    this.onResize();
  }


  getPositionsCoords() {
    super.getPositionsCoords();
    this.positions = {
      enemiesCheckBox : {
        x : this.posX + 60,
        y : this.posY - 50
      },
      settingsButton : {
        x : this.state.game.width-115,
        y : this.state.game.height-60
      },
      enemiesDescriptionsText : {
        x : this.posX - 100,
        y : this.posY - 50
      }
    }
  }

  onResize() {
    this.getPositionsCoords();
    this.enemiesDescriptionsText.reset(this.positions.enemiesDescriptionsText.x,this.positions.enemiesDescriptionsText.y);
    this.background.reset(this.posX,this.posY);
    this.checkBox.reset(this.positions.enemiesCheckBox.x,this.positions.enemiesCheckBox.y);
    this.settingsButton.reset(this.positions.settingsButton.x,this.positions.settingsButton.y);
    super.onResize();
  }
}
