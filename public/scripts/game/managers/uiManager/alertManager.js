class AlertManager {
  constructor(uiManager) {
    this.uiManager = uiManager;
    this.state = uiManager.state;
    this.counter = 1;
    this.allAlertsHeight = 110;
  }

  initialize() {
    this.alertFrames = this.state.add.group();
    this.texts = this.state.add.group();

    this.uiManager.addToGroup(this.alertFrames);
    this.uiManager.addToGroup(this.texts);
  }

  moveUpAlerts() {
    this.texts.children.forEach(child => {
      child.y -= this.allAlertsHeight;
    });
    this.alertFrames.children.forEach(child => {
      child.y -= this.allAlertsHeight;
    });
  }

  hideWindow(alertFrame,text) {
    alertFrame.alpha -= 0.1;
    text.alpha -= 0.1;
    if(alertFrame.alpha <= 0){
      alertFrame.kill();
      text.kill();
      this.counter -= 1;
      this.moveUpAlerts();
      return;
    }
    let self = this;
    setTimeout(function(){
      self.hideWindow(alertFrame,text);
    }, 100);
  }

  showWindow(text,key) {
    key = key || "normalAlert";

    let alertFrame = this.alertFrames.getFirstExists(false);
    if(!alertFrame){
    // if(true){
      alertFrame = this.state.game.add.sprite(-1000,-1000, key);
      this.alertFrames.add(alertFrame);
    }

    alertFrame.loadTexture(key);
    alertFrame.reset(this.state.game.width/2,alertFrame.height * this.counter - 10,key);
    alertFrame.anchor.setTo(0.5);
    alertFrame.alpha = 1.0;

    let alertText = this.texts.getFirstExists(false);
    if(!alertText){
      alertText = this.state.add.text(this.state.game.width/2,alertFrame.height * this.counter);
      this.texts.add(alertText);
    } else {
      alertText.reset(this.state.game.width/2,alertFrame.height * this.counter);
    }
    this.state.styleText(alertText);
    alertText.anchor.setTo(0.5);
    alertText.alpha = 1.0;
    alertText.text = text;
    this.counter += 1;
    let self = this;
    setTimeout(function(){
      self.hideWindow(alertFrame,alertText);
    }, 3000);

    alertFrame.visible = true;
    alertText.visible = true;

    this.uiManager.bringItemToTop(this.alertFrames);
    this.uiManager.bringItemToTop(this.texts);
    this.state.fixText(alertText);
    asd = alertText;
  }

  showTownAlert(text) {
    this.showWindow(text,"townAlert");
  }
  showDamageEnemyAlert(text) {
    this.showWindow(text,"damageEnemyAlert");
  }
  showDamagePlayerAlert(text) {
    this.showWindow(text,"damagePlayerAlert");
  }
  showHealthAlert(text) {
    this.showWindow(text,"healthAlert");
  }
  showSomeoneElseFightingAlert() {
    this.showWindow("someone else is fighting with this enemy !","someoneElseFightingAlert");
  }
  showDodgeAlert(text) {
    this.showWindow(text || "dodge !","dodgeAlert");
  }
  showLevelUpAlert(text) {
    this.showWindow(text || 'you just reached ' + this.state.player.level + " lvl !");
  }
}
