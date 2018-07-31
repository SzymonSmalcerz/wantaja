class UIFrameManager {
  constructor(state,uiManager,keyboardButtonTriger) {
    if(!state || !uiManager || !keyboardButtonTriger){
      throw new Error("inherited class MUST provide state/uiManager/keyboardButtonTriger");
    }
    this.state = state;
    this.uiManager = uiManager;
    this.posX = state.game.width/2;
    this.posY = state.game.height/2;
    this.lastTime = 0;
    this.keyboardButtonTriger = keyboardButtonTriger;
    this.frameGroup = undefined;
  }

  initialize() {
    throw new Error("inherited class MUST override this method!");
  }

  onResize() {
    throw new Error("inherited class MUST override this method!");
  }

  update() {
    if(this.state.game.input.keyboard.isDown(this.keyboardButtonTriger) && Date.now() - this.lastTime > 200){
      this.lastTime = Date.now();
      this.toggleWindow();
    }
  }

  showWindow(){
    this.uiManager.closeAllWindows();
    this.frameGroup.visible = true;
    this.state.game.world.bringToTop(this.frameGroup);
  }

  hideWindow(){
    this.frameGroup.visible = false;
  }

  toggleWindow(){
    console.log("XD");
    if(this.frameGroup.visible){
      this.hideWindow();
    } else {
      this.showWindow();
    };
  }

  getPositionsCoords() {
    this.posX = this.state.game.width/2;
    this.posY = this.state.game.height/2;
  }

}
