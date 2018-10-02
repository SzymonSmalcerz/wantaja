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
    this.missionsIcon = new Button(state,state.game.width-95,state.game.height-147,"missionsIcon",0,1,2,3);
    this.uiManager.blockPlayerMovementsWhenOver(this.missionsIcon,true);
    this.backgroundIcons = state.game.add.sprite(state.game.width-300,state.game.height-170,"backgroundIcons");
    this.uiManager.blockPlayerMovementsWhenOver(this.backgroundIcons);

    this.expandedMenu = this.state.game.add.group();
    this.expandedMenu.add(this.backgroundIcons);
    this.expandedMenu.add(this.characterDataIcon);
    this.expandedMenu.add(this.eqIcon);
    this.expandedMenu.add(this.statusIcon);
    this.expandedMenu.add(this.missionsIcon);
    this.expandedMenu.setAll("anchor",{
      x : 0,
      y : 0
    })
    //adding everything to one group
    this.uiManager.addToGroup(this.expandedMenu);
    this.uiManager.addToGroup(this.expandArrow);

    this.onResize();
  }

  toggleExpandedMenu() {
    this.expandedMenu.visible = !this.expandedMenu.visible;
  }

  showExpandedMenu() {
    this.expandedMenu.visible = true;
  }

  closeExpandedMenu() {
    this.expandedMenu.visible = false;
    this.expandArrow.uncheck();
  }

  bringToTop() {
    this.state.game.world.bringToTop(this.expandedMenu);
    this.state.game.world.bringToTop(this.expandArrow);
  }

  onResize() {
    let state = this.state;
    this.expandArrow.reset(state.game.width-60,state.game.height-60);
    this.characterDataIcon.reset(state.game.width-260,state.game.height-147);
    this.eqIcon.reset(state.game.width-205,state.game.height-147);
    this.statusIcon.reset(state.game.width-150,state.game.height-147);
    this.missionsIcon.reset(state.game.width-95,state.game.height-147);
    this.backgroundIcons.reset(state.game.width-300,state.game.height-170);
    this.bringToTop();
    this.closeExpandedMenu();
  }

  update() {}
}
