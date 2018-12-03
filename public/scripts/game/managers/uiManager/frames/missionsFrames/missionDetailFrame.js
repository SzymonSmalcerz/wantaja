class MissionDetailFrame extends UIFrameManager {
  constructor(state,uiManager,missionsListFrame) {
    super(state,uiManager,null,'','missionDetailFrame',true, {
      previousFrame : missionsListFrame
    });
  }

  initialize() {

    this.missionDescription = this.state.add.text();
    this.missionDescription.anchor.setTo(0,0);
    this.missionDescription.text = '';
    this.missionImage = this.state.game.add.sprite();
    this.missionImage.anchor.setTo(0.5);
    this.state.styleText(this.missionDescription);
    this.frameGroup.add(this.missionDescription);
    this.frameGroup.add(this.missionImage);

    this.hideWindow();
    this.onResize();
  }

  getPositionsCoords() {
    super.getPositionsCoords();
    this.descriptionPos = {
      x : this.posX - 100,
      y : this.posY + 30
    }
    this.imagePos = {
      x : this.posX,
      y : this.posY - 40
    }
  }

  onResize() {
    this.getPositionsCoords();
    this.missionDescription.reset(this.descriptionPos.x, this.descriptionPos.y);
    this.missionImage.reset(this.imagePos.x, this.imagePos.y);
    super.onResize();
  }

  showWindow(missionName) {
    this.missionDescription.text = '';
    let currentStage = handler.missions[missionName].currentStage;
    if(currentStage.type == 'goto') {
      this.missionDescription.text += `go to ${currentStage.highLights[0].npcKey.split('_').join(' ')}!\n`;
      this.missionDescription.text += `(waiting in ${currentStage.highLights[0].mapKey})\n`;
      this.missionImage.loadTexture(currentStage.highLights[0].npcKey);
    } else if(currentStage.type == 'kill') {
      this.missionDescription.text += `kill ${currentStage.enemyKey.split('_').join(' ')}!\n`;
      this.missionDescription.text += `( killed ${(currentStage.numberOryginal - currentStage.numberLeft)}/${currentStage.numberOryginal} )`;
      this.missionImage.loadTexture(currentStage.enemyKey);
    }
    this.frameTitle.text = missionName;
    super.setTitleWidth();
    super.showWindow();

    this.state.fixText(this.missionDescription);
    this.state.fixText(this.frameTitle);
  }

}
