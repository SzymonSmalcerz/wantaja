class MissionsListFrame extends UIFrameManager {
  constructor(state,uiManager) {
    super(state,uiManager,Phaser.Keyboard.M,'Missions','frame');
  }

  initialize() {
    this.missionsIcons = this.state.add.group();
    this.missionsTitles = this.state.add.group();
    this.missionsExclamationMarks = this.state.add.group();

    this.missionDetailFrame = new MissionDetailFrame(this.state,this.uiManager,this);
    this.missionDetailFrame.initialize();



    this.frameGroup.add(this.missionsIcons);
    this.frameGroup.add(this.missionsTitles);
    this.frameGroup.add(this.missionsExclamationMarks);

    this.missionRewardFrame = new MissionRewardFrame(this);
    this.missionRewardFrame.initialize();
    this.uiManager.addToGroup(this.missionRewardFrame);
    this.missionRewardFrame.hideWindow();

    this.hideWindow();
    this.onResize();
  }

  getPositionsCoords() {
    super.getPositionsCoords();
  }

  showReward(data) {
    this.missionRewardFrame.showWindow(data);
  }

  onResize() {
    this.missionDetailFrame.onResize();
    this.missionRewardFrame.onResize();
    this.getPositionsCoords();
    super.onResize();
  }

  hideWindow() {
    this.missionDetailFrame.hideWindow();
    super.hideWindow();
  }

  showWindow() {
    let i = 0;
    this.missionsIcons.children.forEach(missionIcon => {missionIcon.kill();})
    this.missionsTitles.children.forEach(missionTitle => {missionTitle.kill();})
    this.missionsExclamationMarks.children.forEach(missionExclamationMark => {missionExclamationMark.kill();})
    for (var missionName in handler.missions) {
      if(handler.missions.hasOwnProperty(missionName)) {
        let icon = this.missionsIcons.getFirstDead();
        if(!icon) {
          icon = new Button(this.state, -500, -500, 'missionIcon', 0,1,2,3);
          this.uiManager.blockPlayerMovementsWhenOver(icon);
          this.missionsIcons.add(icon);
          icon.addOnInputDownFunction(function() {
            this.missionDetailFrame.showWindow(icon.missionName);
            if(icon.exMark) {
              this.state.removeExclamationMark(icon.exMark.stageCrypto);
            }
          }, this)
        }
        icon.missionName = missionName;
        icon.exMark = null;
        icon.reset(this.posX - 70 + (i%3) * 70, this.posY - 50 + Math.floor(i/3) * 70);

        let missionTitleText = this.missionsTitles.getFirstDead();
        if(!missionTitleText) {
          missionTitleText = this.state.add.text();
          missionTitleText.anchor.setTo(0.5,0.5);
          this.state.styleText(missionTitleText);
          this.missionsTitles.add(missionTitleText);
          missionTitleText.fontSize = 14;
        }
        missionTitleText.text = missionName;
        missionTitleText.reset(this.posX - 70 + (i%3) * 70, this.posY - 50 + Math.floor(i/3) * 70 - 40);
        if(handler.notOpenedMissions.indexOf(missionName + '_' + handler.missions[missionName].currentStage.name) > -1) {
          let exMark = this.missionsExclamationMarks.getFirstDead();
          if(!exMark) {
            exMark = this.state.game.add.sprite(0,0, "exclamationMark");
            exMark.anchor.setTo(0.5);
            exMark.animations.add("glow", [0,1,2,3,2,1], 3, true);
            this.missionsExclamationMarks.add(exMark);
          }

          exMark.stageCrypto = missionName + '_' + handler.missions[missionName].currentStage.name;
          icon.exMark = exMark;
          exMark.reset(this.posX - 70 + (i%3) * 70, this.posY - 50 + Math.floor(i/3) * 70);
          exMark.animations.play("glow");
        }

        i += 1;
      }
    }
    super.showWindow();
  }

}
