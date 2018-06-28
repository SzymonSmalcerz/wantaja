class FightingStageUIManager {
  constructor(mainFightManager){
    this.state = mainFightManager.state;
    this.mainFightManager = mainFightManager;
    this.skillsUIManager = new SkillsUIManager(mainFightManager);
    this.winUIManager = new WinUIManager(mainFightManager);
  };

  initialize(){

    let state = this.state;
    console.log(this.state);
    console.log(this.mainFightManager.state);
    state.fightingStage = state.add.group();
    this.skillsUIManager.initialize();
    this.winUIManager.initialize();

    state.fightingStageBackground = state.add.sprite(state.game.width/2,state.game.width/2,"fightingBackgroungFirstMap");
    state.fightingStageBackground.anchor.setTo(0.5);
    state.enemyLogo = state.game.add.sprite(state.game.width - 78,8,"spiderlogo");
    state.emptyHpBarEnemy = state.game.add.sprite(state.game.width - 210,15,"healthBarDark");
    state.fullHpBarEnemy = state.game.add.sprite(state.game.width - 210,15,"healthBar");

    state.emitter = state.game.add.emitter();
    state.emitter.makeParticles("bloodParticle");
    state.emitter.minParticleSpeed.setTo(-35,-10);
    state.emitter.maxParticleSpeed.setTo(35,45);
    state.emitter.gravity = 0;

    state.fightingStage.add(state.fightingStageBackground);
    this.skillsUIManager.addSkillButtonsToStageGroup(state.fightingStage);
    state.fightingStage.add(state.emitter);
    state.fightingStage.add(state.enemyLogo);
    state.fightingStage.add(state.emptyHpBarEnemy);
    state.fightingStage.add(state.fullHpBarEnemy);


    let self = this;
    state.fightingStage.showSkillsButtons = function(){
      self.skillsUIManager.showSkillButtons();
    };

    state.fightingStage.hideSkillsButtons = function(){
      self.skillsUIManager.hideSkillButtons();
    };
    state.fightingStage.visible = false;
    state.fightingStage.fixedToCamera = true;
  };

  animateEnemySkill(skillName){
    this.skillsUIManager.animateEnemySkill(skillName);
  }

  onResize(){
    let state = this.state;
    state.enemyLogo.reset(state.game.width - 78,8);
    state.emptyHpBarEnemy.reset(state.game.width - 210,15);
    state.fullHpBarEnemy.reset(state.game.width - 210,15);
    this.skillsUIManager.onResize();
    this.winUIManager.onResize();
  };
}
