class CharacterDataManager {
  constructor(state,uiManager){
    this.state = state;
    this.uiManager = uiManager;
    this.posX = state.game.width/2;
    this.posY = state.game.height/2;
    // this.attributesNames = ["attack","health","mana"];
    this.getPositionsCoords();

    this.lastTime = 0;
  }

  initialize() {
    let state = this.state;
    state.characterData = state.add.group();
    state.characterDataBackground = state.game.add.sprite(this.posX,this.posY,"characterDataFrame");
    state.characterDataBackground.anchor.setTo(0.5);
    this.uiManager.blockPlayerMovementsWhenOver(state.characterDataBackground);
    state.characterData.add(state.characterDataBackground);

    state.characterData.fixedToCamera = true;
    this.hideCharacterDataWindow();
  }

  showCharacterDataWindow(){
    this.uiManager.closeAllWindows();
    this.state.game.world.bringToTop(this.state.characterData);
    this.state.characterData.visible = true;
    // this.checkIfStatusPointsRemaining();
    // this.updateStatusText();
  }

  hideCharacterDataWindow(){
    this.state.characterData.visible = false;
  }

  toggleCharacterDataWindow(){
    if(this.state.characterData.visible){
      this.hideCharacterDataWindow();
    } else {
      this.showCharacterDataWindow();
    };
  }

  getPositionsCoords() {
    this.posX = this.state.game.width/2;
    this.posY = this.state.game.height/2;
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

  update() {
    if(this.state.game.input.keyboard.isDown(Phaser.Keyboard.X) && Date.now() - this.lastTime > 200){
      this.lastTime = Date.now();
      this.toggleCharacterDataWindow();
    }
  }

  onResize() {
    this.getPositionsCoords();
  }
}
