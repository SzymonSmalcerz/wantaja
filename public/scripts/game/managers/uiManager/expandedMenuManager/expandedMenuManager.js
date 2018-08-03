class ExpandedMenuManager {
  constructor(state,uiManager){
    this.state = state;
    this.uiManager = uiManager;
  }

  initialize() {
    let state = this.state;

    state.expandArrow = new CheckBox(state.game,0,0,false,0,1,2,3,4,5,6,7,false,"expandArrow");
    state.expandArrow.anchor.setTo(0);
    state.expandArrow.addOnUncheckFunction(function() {
      this.closeExpandedMenu();
    },this);
    state.expandArrow.addOnCheckFunction(function() {
      this.showExpandedMenu();
    },this);
    this.uiManager.blockPlayerMovementsWhenOver(state.expandArrow);

    state.eqIcon = new Button(state.game,state.game.width-205,state.game.height-147,"eqIcon",0,1,2,3);
    state.eqIcon.anchor.setTo(0);
    state.eqIcon.visible = false;
    this.uiManager.blockPlayerMovementsWhenOver(state.eqIcon,true);
    state.statusIcon = new Button(state.game,state.game.width-150,state.game.height-147,"statusIcon",0,1,2,3);
    state.statusIcon.anchor.setTo(0);
    state.statusIcon.visible = false;
    state.statusIcon.addOnInputDownFunction(function() {
      this.uiManager.toggleStatusPointWindow();
      this.closeExpandedMenu();
    },this);
    this.uiManager.blockPlayerMovementsWhenOver(state.statusIcon,true);
    state.missionsIcon = new Button(state.game,state.game.width-95,state.game.height-147,"missionsIcon",0,1,2,3);
    state.missionsIcon.anchor.setTo(0);
    state.missionsIcon.visible = false;
    this.uiManager.blockPlayerMovementsWhenOver(state.missionsIcon,true);
    state.backgroundIcons = state.game.add.sprite(state.game.width-245,state.game.height-170,"backgroundIcons");
    state.backgroundIcons.visible = false;
    this.uiManager.blockPlayerMovementsWhenOver(state.backgroundIcons);

    //adding everything to one group
    this.uiManager.addToGroup(state.backgroundIcons);
    this.uiManager.addToGroup(state.expandArrow);
    this.uiManager.addToGroup(state.eqIcon);
    this.uiManager.addToGroup(state.statusIcon);
    this.uiManager.addToGroup(state.missionsIcon);

    this.onResize();
  }

  toggleExpandedMenu() {
    this.state.eqIcon.visible = !this.state.eqIcon.visible;
    this.state.statusIcon.visible = !this.state.statusIcon.visible;
    this.state.missionsIcon.visible = !this.state.missionsIcon.visible;
    this.state.backgroundIcons.visible = !this.state.backgroundIcons.visible;
  }

  showExpandedMenu() {
    this.state.eqIcon.visible = true;
    this.state.statusIcon.visible = true;
    this.state.missionsIcon.visible = true ;
    this.state.backgroundIcons.visible = true;
  }

  closeExpandedMenu() {
    this.state.eqIcon.visible = false;
    this.state.statusIcon.visible = false;
    this.state.missionsIcon.visible = false;
    this.state.backgroundIcons.visible = false;
    this.state.expandArrow.uncheck();
  }

  onResize() {
    let state = this.state;
    state.expandArrow.reset(state.game.width-60,state.game.height-60);
    state.eqIcon.reset(state.game.width-205,state.game.height-147);
    state.statusIcon.reset(state.game.width-150,state.game.height-147);
    state.missionsIcon.reset(state.game.width-95,state.game.height-147);
    state.backgroundIcons.reset(state.game.width-245,state.game.height-170);
    this.closeExpandedMenu();
  }

  update() {
  }
}
