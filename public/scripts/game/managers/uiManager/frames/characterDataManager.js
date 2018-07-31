class CharacterDataManager extends UIFrameManager{
  constructor(state,uiManager) {
    super(state,uiManager,Phaser.Keyboard.X);
  }

  initialize() {
    this.getPositionsCoords();
    let state = this.state;
    state.characterData = state.add.group();
    this.frameGroup = state.characterData;
    state.characterDataBackground = state.game.add.sprite(this.posX,this.posY,"characterDataFrame");
    state.characterDataBackground.anchor.setTo(0.5);
    this.uiManager.blockPlayerMovementsWhenOver(state.characterDataBackground);
    state.characterData.add(state.characterDataBackground);
    state.characterData.fixedToCamera = true;
    this.hideWindow();
  }


  getPositionsCoords() {
    super.getPositionsCoords();
    this.positions = {
      questionMark : {
        x : this.posX - 37,
        y : this.posY - 53,
        difference : 60
      },

      plusButton : {
        x : this.posX + 80,
        y : this.posY - 65,
        difference : 60
      }
    }
  }

  onResize() {
    this.getPositionsCoords();
  }
}
