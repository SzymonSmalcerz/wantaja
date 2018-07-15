class ExpandedMenuManager {
  constructor(state,uiManager){
    this.state = state;
    this.uiManager = uiManager;
  }

  initialize(){
    let state = this.state;

    state.expandArrow = new Button(state.game,state.game.width-70,state.game.height-60,"expandArrow",0,1,2,3);
    state.expandArrow.anchor.setTo(0);
    state.expandArrow.addOnInputDownFunction(function(){
      this.toggleExpandedMenu();
    },this);
    this.uiManager.blockPlayerMovementsWhenOver(state.expandArrow);

    state.eqIcon = new Button(state.game,state.game.width-205,state.game.height-147,"eqIcon",0,1,2,3);
    state.eqIcon.anchor.setTo(0);
    state.eqIcon.visible = false;
    this.uiManager.blockPlayerMovementsWhenOver(state.eqIcon,true);
    state.statusIcon = new Button(state.game,state.game.width-150,state.game.height-147,"statusIcon",0,1,2,3);
    state.statusIcon.anchor.setTo(0);
    state.statusIcon.visible = false;
    state.statusIcon.addOnInputDownFunction(function(){
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
    state.ui = state.ui || state.add.group();

    state.ui.add(state.backgroundIcons);
    state.ui.add(state.expandArrow);
    state.ui.add(state.eqIcon);
    state.ui.add(state.statusIcon);
    state.ui.add(state.missionsIcon);

  }

  toggleExpandedMenu(){
    this.state.eqIcon.visible = !this.state.eqIcon.visible;
    this.state.statusIcon.visible = !this.state.statusIcon.visible;
    this.state.missionsIcon.visible = !this.state.missionsIcon.visible;
    this.state.backgroundIcons.visible = !this.state.backgroundIcons.visible;
  }

  closeExpandedMenu(){
    this.state.eqIcon.visible = false;
    this.state.statusIcon.visible = false;
    this.state.missionsIcon.visible = false;
    this.state.backgroundIcons.visible = false;
  }

  onResize(){

  }

  update(){
  }
}
