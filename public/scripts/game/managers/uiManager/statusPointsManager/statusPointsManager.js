class StatusPointsManager {
  constructor(state,uiManager){
    this.state = state;
    this.uiManager = uiManager;
    this.posX = state.game.width/2;
    this.posY = state.game.height/2;
    this.statusPointsNames = ["strength","vitality","intelligence","agility"];
    this.positions = {
      questionMark : {
        x : this.posX - 37,
        y : this.posY - 53,
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
    state.statusPoints.add(state.statusPointsBackground);
    state.statusPoints.questionMarks = [];

    for(let i=0;i<this.statusPointsNames.length;i++){
      state.statusPoints.questionMarks.push(state.game.add.sprite(this.positions.questionMark.x,this.positions.questionMark.y  + i*this.positions.questionMark.difference, "questionMark"));
      state.statusPoints.questionMarks[i].anchor.setTo(0.5);
      state.statusPoints.add(state.statusPoints.questionMarks[i]);


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
    console.log("Xddd");
  }

  onResize() {
    let state = this.state;
    console.log(":)");
  };
}
