class StatusPointsManager {
  constructor(state,uiManager){
    this.state = state;
    this.uiManager = uiManager;
    this.posX = state.game.width/2;
    this.posY = state.game.height/2;
    this.statusPointsNames = ["strength","vitality","intelligence","agility"];
    this.getPositionsCoords();

    this.lastTime = 0;
  }

  getPositionsCoords() {
    this.posX = this.state.game.width/2;
    this.posY = this.state.game.height/2;
    this.positions = {
      questionMark : {
        x : this.posX - 37,
        y : this.posY - 53,
        difference : 60
      },

      plusButton : {
        x : this.posX + 80,
        y : this.posY - 65,
        difference : 60
      }
    }
  }
  initialize() {
    let state = this.state;
    state.statusPoints = state.add.group();
    // state.statusPointsBackground = state.game.add.sprite(state.game.world.width/2,state.game.world.height/2,"statusPoints");
    state.statusPointsBackground = state.game.add.sprite(this.posX,this.posY,"statusPoints");
    state.statusPointsBackground.anchor.setTo(0.5);
    this.uiManager.blockPlayerMovementsWhenOver(state.statusPointsBackground);
    state.statusPoints.add(state.statusPointsBackground);

    state.statusPointsCloseButton = new Button(this.state.game,this.posX + 83, this.posY - 128,"closeButton",0,1,2,3);
    state.statusPoints.add(state.statusPointsCloseButton);
    this.uiManager.blockPlayerMovementsWhenOver(state.statusPointsCloseButton,true);
    state.statusPointsCloseButton.addOnInputDownFunction(function(){
      this.toggleStatusPointWindow();
    },this);

    state.statusPoints.plusButtons = [];

    for(let i=0;i<this.statusPointsNames.length;i++){
      state.statusPoints.plusButtons.push(new Button(this.state.game,this.positions.plusButton.x,this.positions.plusButton.y  + i*this.positions.plusButton.difference, "plusButton",0,1,2,3));
      state.statusPoints.plusButtons[i].anchor.setTo(0.5);
      state.statusPoints.add(state.statusPoints.plusButtons[i]);
      this.uiManager.blockPlayerMovementsWhenOver(state.statusPoints.plusButtons[i]);
      state.statusPoints.plusButtons[i].addOnInputDownFunction(function(){
        this.addStatus(this.statusPointsNames[i]);
      },this);
    };


    state.statusPoints.questionMarks = [];

    for(let i=0;i<this.statusPointsNames.length;i++){
      state.statusPoints.questionMarks.push(state.game.add.sprite(this.positions.questionMark.x,this.positions.questionMark.y  + i*this.positions.questionMark.difference, "questionMark"));
      state.statusPoints.questionMarks[i].anchor.setTo(0.5);
      state.statusPoints.add(state.statusPoints.questionMarks[i]);
      this.uiManager.blockPlayerMovementsWhenOver(state.statusPoints.questionMarks[i]);


      state["statusPoints_" + this.statusPointsNames[i] + "_description"] = state.game.add.sprite(this.positions.questionMark.x,this.positions.questionMark.y  + i*this.positions.questionMark.difference,"statusPoints_" + this.statusPointsNames[i] + "_description");
      state["statusPoints_" + this.statusPointsNames[i] + "_description"].anchor.setTo(0.3,1);
      // state["statusPoints_" + this.statusPointsNames[i] + "_description"].alpha = 0.9;
      state["statusPoints_" + this.statusPointsNames[i] + "_description"].visible = false;
      state.statusPoints.add(state["statusPoints_" + this.statusPointsNames[i] + "_description"]);

      state.statusPoints.questionMarks[i].inputEnabled = true;
      state.statusPoints.questionMarks[i].events.onInputOver.add(function(){
        this.state["statusPoints_" + this.statusPointsNames[i] + "_description"].visible = true;
      },this);
      state.statusPoints.questionMarks[i].events.onInputDown.add(function(){
        this.state["statusPoints_" + this.statusPointsNames[i] + "_description"].visible = true;
      },this);
      state.statusPoints.questionMarks[i].events.onInputOut.add(function(){
        this.state["statusPoints_" + this.statusPointsNames[i] + "_description"].visible = false;
      },this);
      state.statusPoints.questionMarks[i].events.onInputUp.add(function(){
        this.state["statusPoints_" + this.statusPointsNames[i] + "_description"].visible = false;
      },this);
    }

    state.statusPoints.fixedToCamera = true;
    this.onResize();
    this.hideStatusPointWindow();
  }

  showStatusPointWindow(){
    this.state.statusPoints.visible = true;
    // console.log("XDDD");
    // this.state.player.blockMovement();
  }

  hideStatusPointWindow(){
    this.state.statusPoints.visible = false;
    // this.state.player.unblockMovement();
  }

  toggleStatusPointWindow(){
    if(this.state.statusPoints.visible){
      this.hideStatusPointWindow();
    } else {
      this.showStatusPointWindow();
    };
  }

  update(){
    if(this.state.game.input.keyboard.isDown(Phaser.Keyboard.C) && Date.now() - this.lastTime > 200){
      this.lastTime = Date.now();
      this.toggleStatusPointWindow();
    }
  }

  addStatus(statusName){
    console.log(statusName);
  }

  onResize() {
    this.getPositionsCoords();
    let state = this.state;
    for(let i=0;i<this.statusPointsNames.length;i++){
      state.statusPoints.questionMarks[i].reset(this.positions.questionMark.x,this.positions.questionMark.y  + i*this.positions.questionMark.difference);
    }
    for(let i=0;i<this.statusPointsNames.length;i++){
      state.statusPoints.plusButtons[i].reset(this.positions.plusButton.x,this.positions.plusButton.y  + i*this.positions.plusButton.difference);
    };
    state.statusPointsBackground.reset(this.posX,this.posY);
    state.statusPointsCloseButton.reset(this.posX + 83, this.posY - 128);
  };
}
