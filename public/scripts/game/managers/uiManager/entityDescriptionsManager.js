class EntityDescriptionsManager {

  constructor(uiManager) {
    this.uiManager = uiManager;
    this.state = uiManager.state;
  };

  initialize() {
    this.state.descriptions = this.state.add.group();

    this.enemiesDescriptions = this.state.add.group();
    this.playersDescriptions = this.state.add.group();
    this.state.descriptions.add(this.enemiesDescriptions);
    this.state.descriptions.add(this.playersDescriptions);
  };

  onChangeMap() {
    this.enemiesDescriptions.callAll('kill');
    this.playersDescriptions.callAll('kill');
  }

  hideEnemiesDescriptions() {
    this.enemiesDescriptions.visible = false;
  }

  showEnemiesDescriptions() {
    this.enemiesDescriptions.visible = true;
  }

  addEnemyDescription(enemy) {
    let enemyDescription = this.enemiesDescriptions.getFirstExists(false);
    if(!enemyDescription){
      enemyDescription = this.state.add.text(enemy.x,enemy.y - 10);
      this.state.styleText(enemyDescription);
      enemyDescription.text = enemy.key + " lvl." + enemy.lvl;
      enemyDescription.fontSize = 16;
      this.enemiesDescriptions.add(enemyDescription);
    } else {
      enemyDescription.reset(enemy.x, enemy.y - 10);
    }
    enemyDescription.ownerID = enemy.id;
    enemyDescription.anchor.setTo(0.5,1);
  }

  removeEnemyDescription(enemy) {
    this.enemiesDescriptions.children.forEach(children => {
      if( children.ownerID == enemy.id ) {
        children.ownerID = null;
        children.kill();
      }
    });
  }
};
