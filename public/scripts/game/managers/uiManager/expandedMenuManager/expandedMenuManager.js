class ExpandedMenuManager {
  constructor(state,uiManager){
    this.state = state;
    this.uiManager = uiManager;
  }

  initialize() {
    let state = this.state;

    this.expandArrow = new CheckBox(state,0,0,false,0,1,2,3,4,5,6,7,false,"expandArrow");
    this.expandArrow.anchor.setTo(0);
    this.expandArrow.addOnUncheckFunction(function() {
      this.closeExpandedMenu();
    },this);
    this.expandArrow.addOnCheckFunction(function() {
      this.showExpandedMenu();
    },this);
    this.uiManager.blockPlayerMovementsWhenOver(this.expandArrow);

    this.exclamationMark_expandArrow = this.state.game.add.sprite(0,0, "exclamationMark");
    this.exclamationMark_expandArrow.animations.add("glow", [0,1,2,3,2,1], 3, true);
    this.exclamationMark_expandArrow.animations.play("glow");
    // this.exclamationMark.visible = true;

    this.characterDataIcon = new Button(state,state.game.width-260,state.game.height-147,"characterDataIcon",0,1,2,3);
    this.characterDataIcon.addOnInputDownFunction(function() {
      this.uiManager.toggleCharacterDataWindow();
      this.closeExpandedMenu();
    },this);
    this.uiManager.blockPlayerMovementsWhenOver(this.characterDataIcon,true);
    this.eqIcon = new Button(state,state.game.width-205,state.game.height-147,"eqIcon",0,1,2,3);
    this.eqIcon.addOnInputDownFunction(function() {
      this.uiManager.toggleEquipmentWindow();
      this.closeExpandedMenu();
    },this);
    this.uiManager.blockPlayerMovementsWhenOver(this.eqIcon,true);
    this.statusIcon = new Button(state,state.game.width-150,state.game.height-147,"statusIcon",0,1,2,3);
    this.statusIcon.addOnInputDownFunction(function() {
      this.uiManager.toggleStatusPointWindow();
      this.closeExpandedMenu();
    },this);
    this.uiManager.blockPlayerMovementsWhenOver(this.statusIcon,true);

    this.miniMapIcon = new Button(state,state.game.width-95,state.game.height-147,"miniMapIcon",0,1,2,3);
    this.miniMapIcon.addOnInputDownFunction(function() {
      this.uiManager.toggleMiniMapWindow();
      this.closeExpandedMenu();
    },this);
    this.uiManager.blockPlayerMovementsWhenOver(this.miniMapIcon,true);

    this.missionsIcon = new Button(state,state.game.width-95,state.game.height-147,"missionsIcon",0,1,2,3);
    this.missionsIcon.addOnInputDownFunction(function() {
      this.uiManager.toggleMissionsWindow();
      this.closeExpandedMenu();
    },this);
    this.uiManager.blockPlayerMovementsWhenOver(this.missionsIcon,true);

    this.exclamationMark_missionIcon = this.state.game.add.sprite(0,0, "exclamationMark");
    this.exclamationMark_missionIcon.animations.add("glow", [0,1,2,3,2,1], 3, true);
    this.exclamationMark_missionIcon.animations.play("glow");

    this.backgroundIcons = state.game.add.sprite(state.game.width-300,state.game.height-170,"backgroundIcons");
    this.uiManager.blockPlayerMovementsWhenOver(this.backgroundIcons);

    this.expandedMenu = this.state.game.add.group();
    this.expandedMenu.add(this.backgroundIcons);
    this.expandedMenu.add(this.characterDataIcon);
    this.expandedMenu.add(this.eqIcon);
    this.expandedMenu.add(this.statusIcon);
    this.expandedMenu.add(this.missionsIcon);
    this.expandedMenu.add(this.miniMapIcon);
    this.expandedMenu.add(this.exclamationMark_missionIcon);
    this.expandedMenu.setAll("anchor",{
      x : 0,
      y : 0
    });

    //adding everything to one group
    this.uiManager.addToGroup(this.expandedMenu);
    this.uiManager.addToGroup(this.expandArrow);
    this.uiManager.addToGroup(this.exclamationMark_expandArrow);

    this.onResize();
  }

  toggleExpandedMenu() {
    if(this.expandedMenu.visible) {
      this.closeExpandedMenu();
    } else {
      this.showExpandedMenu();
    }
  }

  showExpandedMenu() {
    this.bringToTop();
    this.expandedMenu.visible = true;
  }

  bringToTop() {
    this.state.game.world.bringToTop(this.expandedMenu);
    this.state.game.world.bringToTop(this.expandArrow);
    this.state.game.world.bringToTop(this.exclamationMark_expandArrow);
  }

  closeExpandedMenu() {
    this.expandedMenu.visible = false;
    this.expandArrow.uncheck();
  }

  bringToTop() {
    this.uiManager.bringItemToTop(this.expandedMenu);
    this.uiManager.bringToTop();
  }

  onResize() {
    let state = this.state;
    this.expandArrow.reset(state.game.width-60,state.game.height-60);
    this.exclamationMark_expandArrow.reset(state.game.width-51,state.game.height-51);
    this.miniMapIcon.reset(state.game.width-315 + 5 + 15,state.game.height-147);
    this.characterDataIcon.reset(state.game.width-260 + 5 + 15,state.game.height-147);
    this.eqIcon.reset(state.game.width-205 + 5 + 15,state.game.height-147);
    this.statusIcon.reset(state.game.width-150 + 5 + 15,state.game.height-147);
    this.missionsIcon.reset(state.game.width-95 + 5 + 15,state.game.height-147);
    this.exclamationMark_missionIcon.reset(state.game.width-86 + 5 + 15,state.game.height-138);
    this.backgroundIcons.reset(state.game.width-320,state.game.height-170);
    this.bringToTop();
    this.closeExpandedMenu();
    this.updateExclamationMarks();
  }

  updateExclamationMarks() {
    if(handler.notOpenedMissions.length == 0) {
      this.exclamationMark_expandArrow.visible = false;
      this.exclamationMark_missionIcon.visible = false;
    } else {
      this.exclamationMark_expandArrow.visible = true;
      this.exclamationMark_missionIcon.visible = true;
    }
  }

  update() {}
}
