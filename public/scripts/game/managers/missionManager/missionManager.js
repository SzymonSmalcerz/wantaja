class MissionManager extends Phaser.Group {
  constructor(state) {
    super(state.game);
    this.state = state;
    this.questionMarksManager = new QuestionMarksManager(this);
    this.dialogWindow = new DialogWindow(this);
    this.add(this.questionMarksManager);
    this.add(this.dialogWindow);
  }

  initialize() {
    for (var missonName in handler.missions) {
      if(handler.missions.hasOwnProperty(missonName)) {
          handler.missions[missonName].currentStage.highLights.forEach(highLight => {
            if(highLight.mapKey == handler.playerData.currentMapName) {
              if(this.state.allEntities.npcs[highLight.npcKey]) {
                this.state.allEntities.npcs[highLight.npcKey].highLight(handler.missions[missonName]);
              }
            }
          })
      }
    }
  }

  onResize() {
    this.questionMarksManager.onResize();
    this.dialogWindow.onResize();
  }

  showDialogWindow(data) {
    this.bringToTop();
    this.dialogWindow.showWindow(data);
  }

  addNewQuestionMark(npc) {
    this.questionMarksManager.addNewQuestionMark(npc);
  }

  removeQuestionMark(npc) {
    this.questionMarksManager.removeQuestionMark(npc);
  }

  onMapChange() {
    this.questionMarksManager.onMapChange();
    this.removeAll(true);
  }

  bringToTop(item) {
    if(item) {
      super.bringToTop(item);
    }
    this.game.world.bringToTop(this);
  }
}
