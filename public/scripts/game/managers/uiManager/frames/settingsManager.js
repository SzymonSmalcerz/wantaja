class SettingsManager extends UIFrameManager {
  constructor(state,uiManager){
    super(state,uiManager,Phaser.Keyboard.Z,'Settings');
    this.getPositionsCoords();
  }

  initialize() {
    let state = this.state;
    state.optionsManager = this.frameGroup;

    this.checkBoxEnemiesDescriptions = new CheckBox(this.state,0,0,true,0,1,2,3,4,5,6,7);
    this.uiManager.blockPlayerMovementsWhenOver(this.checkBoxEnemiesDescriptions);
    this.number = 0;
    this.checkBoxEnemiesDescriptions.addOnCheckFunction(function(){
      this.uiManager.showEnemiesDescriptions();
    }, this)
    this.checkBoxEnemiesDescriptions.addOnUncheckFunction(function(){
      this.uiManager.hideEnemiesDescriptions();
    }, this)

    this.enemiesDescriptionsText = state.add.text();
    this.enemiesDescriptionsText.anchor.setTo(0,0.5);
    this.enemiesDescriptionsText.text = "show enemies\ndescriptions:"
    this.state.styleText(this.enemiesDescriptionsText);
    this.frameGroup.add(this.checkBoxEnemiesDescriptions);
    this.frameGroup.add(this.enemiesDescriptionsText);

    this.checkBoxNpcsDescriptions = new CheckBox(this.state,0,0,true,0,1,2,3,4,5,6,7);
    this.uiManager.blockPlayerMovementsWhenOver(this.checkBoxNpcsDescriptions);
    this.number = 0;
    this.checkBoxNpcsDescriptions.addOnCheckFunction(function(){
      this.uiManager.showNpcsDescriptions();
    }, this)
    this.checkBoxNpcsDescriptions.addOnUncheckFunction(function(){
      this.uiManager.hideNpcsDescriptions();
    }, this)

    this.npcsDescriptionsText = state.add.text();
    this.npcsDescriptionsText.anchor.setTo(0,0.5);
    this.npcsDescriptionsText.text = "show npcs\ndescriptions:"
    this.state.styleText(this.npcsDescriptionsText);
    this.frameGroup.add(this.checkBoxNpcsDescriptions);
    this.frameGroup.add(this.npcsDescriptionsText);

    this.checkBoxPlayersDescriptions = new CheckBox(this.state,0,0,true,0,1,2,3,4,5,6,7);
    this.uiManager.blockPlayerMovementsWhenOver(this.checkBoxPlayersDescriptions);
    this.number = 0;
    this.checkBoxPlayersDescriptions.addOnCheckFunction(function(){
      this.uiManager.showPlayersDescriptions();
    }, this)
    this.checkBoxPlayersDescriptions.addOnUncheckFunction(function(){
      this.uiManager.hidePlayersDescriptions();
    }, this)

    this.playersDescriptionsText = state.add.text();
    this.playersDescriptionsText.anchor.setTo(0,0.5);
    this.playersDescriptionsText.text = "show players\ndescriptions:"
    this.state.styleText(this.playersDescriptionsText);
    this.frameGroup.add(this.checkBoxPlayersDescriptions);
    this.frameGroup.add(this.playersDescriptionsText);

    this.settingsButton = new Button(state,0,0,"settingsButton",0,1,2,3);
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
      settingsButton : {
        x : this.state.game.width-115,
        y : this.state.game.height-60
      },
      enemiesCheckBox : {
        x : this.posX + 60,
        y : this.posY - 50
      },
      enemiesDescriptionsText : {
        x : this.posX - 100,
        y : this.posY - 50
      },
      npcsCheckBox : {
        x : this.posX + 60,
        y : this.posY + 20
      },
      npcsDescriptionsText : {
        x : this.posX - 100,
        y : this.posY + 20
      },
      playersCheckBox : {
        x : this.posX + 60,
        y : this.posY + 90
      },
      playersDescriptionsText : {
        x : this.posX - 100,
        y : this.posY + 90
      }
    }
  }

  onResize() {
    this.getPositionsCoords();
    this.settingsButton.reset(this.positions.settingsButton.x,this.positions.settingsButton.y);
    this.enemiesDescriptionsText.reset(this.positions.enemiesDescriptionsText.x,this.positions.enemiesDescriptionsText.y);
    this.npcsDescriptionsText.reset(this.positions.npcsDescriptionsText.x,this.positions.npcsDescriptionsText.y);
    this.playersDescriptionsText.reset(this.positions.playersDescriptionsText.x,this.positions.playersDescriptionsText.y);
    this.checkBoxEnemiesDescriptions.reset(this.positions.enemiesCheckBox.x,this.positions.enemiesCheckBox.y);
    this.checkBoxNpcsDescriptions.reset(this.positions.npcsCheckBox.x,this.positions.npcsCheckBox.y);
    this.checkBoxPlayersDescriptions.reset(this.positions.playersCheckBox.x,this.positions.playersCheckBox.y);
    super.onResize();
  }
}
