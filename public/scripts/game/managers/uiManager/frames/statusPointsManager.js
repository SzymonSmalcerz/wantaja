class StatusPointsManager extends UIFrameManager {
  constructor(state,uiManager){
    super(state,uiManager,Phaser.Keyboard.C,'Status points');
    this.statusPointsNames = ["strength","vitality","intelligence","agility"];
  }

  initialize() {
    this.getPositionsCoords();
    let state = this.state;

    state.statusPoints = this.frameGroup;
    // state.statusPointsBackground = state.game.add.sprite(state.game.world.width/2,state.game.world.height/2,"statusPoints");
    state.statusPointsBackground = state.game.add.sprite(this.posX,this.posY,"statusPoints");
    state.statusPointsBackground.anchor.setTo(0.5);
    this.uiManager.blockPlayerMovementsWhenOver(state.statusPointsBackground);
    state.statusPoints.add(state.statusPointsBackground);

    // texts
    state.strengthText = state.add.text();
    state.strengthText_2 = state.add.text();
    state.agilityText = state.add.text();
    state.agilityText_2 = state.add.text();
    state.itelligenceText = state.add.text();
    state.itelligenceText_2 = state.add.text();
    state.vitalityText = state.add.text();
    state.vitalityText_2 = state.add.text();
    state.leftStatusPointsText = state.add.text();
    state.leftStatusPointsText.anchor.setTo(0.5);

    this.state.styleText(state.strengthText);
    this.state.styleText(state.agilityText);
    this.state.styleText(state.itelligenceText);
    this.state.styleText(state.vitalityText);
    this.state.styleText(state.strengthText_2);
    this.state.styleText(state.agilityText_2);
    this.state.styleText(state.itelligenceText_2);
    this.state.styleText(state.vitalityText_2);
    this.state.styleText(state.leftStatusPointsText);

    state.statusPoints.add(state.strengthText);
    state.statusPoints.add(state.agilityText);
    state.statusPoints.add(state.itelligenceText);
    state.statusPoints.add(state.vitalityText);
    state.statusPoints.add(state.strengthText_2);
    state.statusPoints.add(state.agilityText_2);
    state.statusPoints.add(state.itelligenceText_2);
    state.statusPoints.add(state.vitalityText_2);
    state.statusPoints.add(state.leftStatusPointsText);

    //end of text

    state.statusPointsCloseButton = new Button(this.state.game,this.posX + 83, this.posY - 128,"closeButton",0,1,2,3);
    state.statusPoints.add(state.statusPointsCloseButton);
    this.uiManager.blockPlayerMovementsWhenOver(state.statusPointsCloseButton,true);
    state.statusPointsCloseButton.addOnInputDownFunction(function(){
      this.toggleWindow();
    },this);

    state.statusPoints.plusButtons = [];

    for(let i=0;i<this.statusPointsNames.length;i++){
      state.statusPoints.plusButtons.push(new Button(this.state.game,this.positions.plusButton.x,this.positions.plusButton.y  + i*this.positions.plusButton.difference, "plusButton",0,1,2,3));
      state.statusPoints.plusButtons[i].anchor.setTo(0.5);
      state.statusPoints.add(state.statusPoints.plusButtons[i]);
      this.uiManager.blockPlayerMovementsWhenOver(state.statusPoints.plusButtons[i]);
      state.statusPoints.plusButtons[i].addOnInputDownFunction(function(){
        this.state.player.leftStatusPoints -= 1;
        this.addStatus(this.statusPointsNames[i]);
        this.checkIfStatusPointsRemaining();
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
    this.hideWindow();
  }

  getPositionsCoords() {
    super.getPositionsCoords();
    this.positions = {
      questionMark : {
        x : this.posX - 37,
        y : this.posY - 53,
        difference : 60
      },

      plusButton : {
        x : this.posX + 77,
        y : this.posY - 65,
        difference : 60
      }
    }
  }

  updateStatusText() {
    let state = this.state;

    state.strengthText.reset(this.positions.questionMark.x+15,this.positions.questionMark.y - 10);
    state.strengthText.text = "pts: " + this.state.player.strength;
    state.strengthText_2.reset(this.positions.questionMark.x-10,this.positions.questionMark.y - 40);
    state.strengthText_2.text = 'strength';

    state.vitalityText.reset(this.positions.questionMark.x+15,this.positions.questionMark.y - 10 + this.positions.questionMark.difference);
    state.vitalityText.text = "pts: " + this.state.player.vitality;
    state.vitalityText_2.reset(this.positions.questionMark.x+-10,this.positions.questionMark.y - 40 + this.positions.questionMark.difference);
    state.vitalityText_2.text = 'vitality';

    state.itelligenceText.reset(this.positions.questionMark.x+15,this.positions.questionMark.y - 10 + this.positions.questionMark.difference * 2);
    state.itelligenceText.text = "pts: " + this.state.player.intelligence;
    state.itelligenceText_2.reset(this.positions.questionMark.x-10,this.positions.questionMark.y - 40 + this.positions.questionMark.difference * 2);
    state.itelligenceText_2.text = 'intelligence';

    state.agilityText.reset(this.positions.questionMark.x+15,this.positions.questionMark.y - 10 + this.positions.questionMark.difference * 3);
    state.agilityText.text = "pts: " + this.state.player.agility;
    state.agilityText_2.reset(this.positions.questionMark.x-10,this.positions.questionMark.y - 40 + this.positions.questionMark.difference * 3);
    state.agilityText_2.text = 'agility';

    state.leftStatusPointsText.reset(this.posX,this.posY - 110);
    state.leftStatusPointsText.text = "left points to add: " + this.state.player.leftStatusPoints;

  }

  disableButtons() {
    for(let i=0;i<this.statusPointsNames.length;i++){
      this.state.statusPoints.plusButtons[i].disableButton();
    }
  }

  enableButtons() {
    for(let i=0;i<this.statusPointsNames.length;i++){
      this.state.statusPoints.plusButtons[i].enableButton();
    }
  }

  showWindow(){
    super.showWindow();
    this.checkIfStatusPointsRemaining();
    this.updateStatusText();
  }

  checkIfStatusPointsRemaining() {
    if(this.state.player.leftStatusPoints <= 0){
      this.disableButtons();
    } else {
      this.enableButtons();
    }
  }

  addStatus(statusName){
    this.state.player[statusName] += 1;
    this.updateStatusText();
    handler.socketsManager.emit("addStatusPoint",{
      playerID : this.state.player.id,
      statusName
    })
  }

  onResize() {
    this.getPositionsCoords();
    this.updateStatusText();
    let state = this.state;
    for(let i=0;i<this.statusPointsNames.length;i++){
      state.statusPoints.questionMarks[i].reset(this.positions.questionMark.x,this.positions.questionMark.y  + i*this.positions.questionMark.difference);
    }
    for(let i=0;i<this.statusPointsNames.length;i++){
      state.statusPoints.plusButtons[i].reset(this.positions.plusButton.x,this.positions.plusButton.y  + i*this.positions.plusButton.difference);
    };
    state.statusPointsBackground.reset(this.posX,this.posY);
    state.statusPointsCloseButton.reset(this.posX + 143, this.posY - 150);
    super.onResize();
  };
}
