class UIFrameManager {
  constructor(state,uiManager,keyboardButtonTriger,frameTitle,frameBackgroundKey) {
    if(!state || !uiManager){
      throw new Error("inherited class MUST provide state/uiManager/frameTitle");
    }
    this.state = state;
    this.uiManager = uiManager;
    this.posX = state.game.width/2;
    this.posY = state.game.height/2;
    this.lastTime = 0;
    this.keyboardButtonTriger = keyboardButtonTriger;
    this.frameGroup = this.state.add.group();
    this.frameGroup.fixedToCamera = true;

    if(frameTitle) {
      this.frameTitle = state.add.text();
      this.frameTitle.anchor.setTo(0.5,0.5);
      this.frameTitle.text = frameTitle;
      this.state.styleText(this.frameTitle);
      this.frameTitle.fontSize = 26;
      while(this.frameTitle.width > 142) {
        this.frameTitle.fontSize -= 1;
      }
      this.frameGroup.add(this.frameTitle);
    }



    this.closeButton = new Button(this.state,this.posX + 83, this.posY - 128,"closeButton",0,1,2,3);
    this.frameGroup.add(this.closeButton);
    this.uiManager.blockPlayerMovementsWhenOver(this.closeButton,true);
    this.closeButton.addOnInputDownFunction(function(){
      this.hideWindow();
    },this);


    this.getPositionsCoords();
    this.frameBackground = state.game.add.sprite(this.posX,this.posY,frameBackgroundKey || 'frame');
    this.frameBackground.anchor.setTo(0.5);
    this.uiManager.blockPlayerMovementsWhenOver(this.frameBackground);
    this.frameGroup.add(this.frameBackground);
  }

  initialize() {
    throw new Error("inherited class MUST override this method!");
  }

  onResize() {
    this.frameBackground.reset(this.posX,this.posY);
    if(this.frameTitle) {
      this.frameGroup.bringToTop(this.frameTitle);
      this.frameTitle.reset(Math.round(this.state.game.width/2 - this.closeButton.width/2),Math.round(this.state.game.height/2 - 132));
    }
    this.frameGroup.bringToTop(this.closeButton);
    this.closeButton.reset(this.posX + this.frameBackground.width/2 - this.closeButton.width/2, this.posY - this.frameBackground.height/2 + this.closeButton.height/2 + 2);
    this.bringToTop();
    this.hideWindow();
    this.frameGroup.setAll("smoothed",false);
  }

  update() {
    if(this.keyboardButtonTriger && this.state.game.input.keyboard.isDown(this.keyboardButtonTriger) && Date.now() - this.lastTime > 200){
      this.lastTime = Date.now();
      this.toggleWindow();
    }
  }

  showWindow() {
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
