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
    for (var missionName in handler.missions) {
      if(handler.missions.hasOwnProperty(missionName)) {
          this.addNewMission(handler.missions[missionName]);
      }
    }
  }

  addNewMission(data) {
    handler.missions[data.missionName] = data;
    handler.missions[data.missionName].currentStage.highLights.forEach(highLight => {
      if(highLight.mapKey == handler.playerData.currentMapName) {
        if(this.state.allEntities.npcs[highLight.npcKey]) {
          this.state.allEntities.npcs[highLight.npcKey].highLight(handler.missions[data.missionName]);
        }
      }
    });

    this.addExclamationMark(data.missionName + '_' + handler.missions[data.missionName].currentStage.name);
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

  removeMission(data) {
    if(!handler.missions[data.missionName]) {
      alert('? changeMissionStage when mission is not present ?!');
      return;
    }
    this.removeHighLightFromMission(data.missionName);
    this.removeExclamationMark(data.missionName + '_' + handler.missions[data.missionName].currentStage.name);
    delete handler.missions[data.missionName];
  }

  changeMissionStage(data) {
    if(!handler.missions[data.missionName]) {
      alert('? changeMissionStage when mission is not present ?!');
      return;
    }

    this.changeHighLights(data);
    this.removeExclamationMark(data.missionName + '_' + handler.missions[data.missionName].currentStage.name);
    handler.missions[data.missionName].currentStage = data.newStage;
    this.addExclamationMark(data.missionName + '_' + data.newStage.name);
  }

  /*
    stageCrypto == stage cryptonim created by adding mission name and stage name
  */
  removeExclamationMark(stageCrypto) {
    handler.notOpenedMissions = handler.notOpenedMissions.filter(name => {
      return name != stageCrypto;
    });
    this.state.updateExclamationMarks();
  }

  removeAllExclamationMarks() {
    handler.notOpenedMissions = [];
    this.state.updateExclamationMarks();
  }

  /*
    stageCrypto == stage cryptonim created by adding mission name and stage name
  */
  addExclamationMark(stageCrypto) {
    handler.notOpenedMissions.push(stageCrypto);
    this.state.updateExclamationMarks();
  }

  changeStageInfo(missionData) {
    if(handler.missions[missionData.missionName]) {
      handler.missions[missionData.missionName].currentStage.numberLeft -= 1;
    }
  }

  changeHighLights(data) {
    data.newStage.highLights.forEach(highLight => {
      if(highLight.mapKey == handler.playerData.currentMapName) {
        if(this.state.allEntities.npcs[highLight.npcKey]) {
          this.state.allEntities.npcs[highLight.npcKey].highLight(handler.missions[data.missionName]);
        }
      }
    })
    this.removeHighLightFromMission(data.missionName);
  }

  removeHighLightFromMission(missionName) {
    handler.missions[missionName].currentStage.highLights.forEach(highLight => {
      if(highLight.mapKey == handler.playerData.currentMapName) {
        if(this.state.allEntities.npcs[highLight.npcKey]) {
          this.state.allEntities.npcs[highLight.npcKey].removeHighLight(missionName);
        }
      }
    });
  }

  bringToTop(item) {
    if(item) {
      super.bringToTop(item);
    }
    this.game.world.bringToTop(this);
  }
}
