class UIFrameManager {
  constructor(state,uiManager,keyboardButtonTriger,frameName) {
    if(!state || !uiManager || !keyboardButtonTriger || !frameName){
      throw new Error("inherited class MUST provide state/uiManager/keyboardButtonTriger/frameName");
    }
    this.state = state;
    this.uiManager = uiManager;
    this.posX = state.game.width/2;
    this.posY = state.game.height/2;
    this.lastTime = 0;
    this.keyboardButtonTriger = keyboardButtonTriger;
    this.frameGroup = this.state.add.group();

    this.frameName = state.add.text();
    this.frameName.anchor.setTo(0.5,0.5);
    this.frameName.text = frameName;
    this.state.styleText(this.frameName);
    this.frameName.fontSize = 26;
    this.frameGroup.add(this.frameName);
  }

  initialize() {
    throw new Error("inherited class MUST override this method!");
  }

  onResize() {
    this.frameGroup.bringToTop(this.frameName);
    this.frameName.reset(Math.round(this.state.game.width/2),Math.round(this.state.game.height/2 - 132));
    this.bringToTop();
    this.hideWindow();
    this.frameGroup.setAll("smoothed",false);
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
    this.bringToTop();
  }

  bringToTop(){
    this.state.game.world.bringToTop(this.frameGroup);
  }

  hideWindow(){
    this.frameGroup.visible = false;
  }

  toggleWindow(){
    if(this.frameGroup.visible){
      this.hideWindow();
    } else {
      this.showWindow();
    };
  }

  getPositionsCoords() {
    this.posX = Math.round(this.state.game.width/2);
    this.posY = Math.round(this.state.game.height/2);
  }

}
