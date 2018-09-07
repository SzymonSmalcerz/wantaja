class EquipmentManager extends UIFrameManager {
  constructor(state,uiManager){
    super(state,uiManager,Phaser.Keyboard.V,null,'equipmentFrame');
    this.getPositionsCoords();
  }

  initialize() {
    let state = this.state;
    state.equipmentManager = this.frameGroup;
    console.log(this.state.player.equipmentCurrentlyDressed);
    this.getPositionsCoords();
    this.dressedUpEq = {};
    let arr = ['weapon'];
    arr.forEach(type => {
      let key = this.state.player.equipmentCurrentlyDressed[type];
      if(key) {
        this.dressedUpEq[type] = this.state.game.add.sprite(this.positions[type].x,this.positions[type].y, key);
        this.frameGroup.add(this.dressedUpEq[type]);
      }
    });


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
    this.hideWindow();
    this.onResize();
  }


  getPositionsCoords() {
    super.getPositionsCoords();
    this.positions = {
      weapon : {
        x : this.posX - 75,
        y : this.posY - 100
      }
    }
  }

  onResize() {
    this.getPositionsCoords();
    super.onResize();
  }
}
